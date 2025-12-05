"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCxcsPorVencer = exports.getCxcsVencidas = exports.getResumenCxcsByCliente = exports.getCxcsByCliente = exports.deleteCxc = exports.updateCxc = exports.createCxc = exports.getCxcById = exports.getCxcs = void 0;
const database_1 = require("../config/database");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const typeorm_1 = require("typeorm");
const Cliente_1 = require("../entities/Cliente");
;
const getCxcs = async (req, res) => {
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    try {
        const filter = req.query;
        const queryBuilder = cxcRepository
            .createQueryBuilder('cxc')
            .leftJoinAndSelect('cxc.cliente', 'cliente')
            .leftJoinAndSelect('cliente.vendedor', 'vendedor')
            .orderBy('cxc.fecha', 'DESC');
        // Filtro por fechas
        if (filter.fechaInicio && filter.fechaFin) {
            queryBuilder.andWhere('cxc.fecha BETWEEN :fechaInicio AND :fechaFin', {
                fechaInicio: new Date(filter.fechaInicio),
                fechaFin: new Date(filter.fechaFin)
            });
        }
        else if (filter.fechaInicio) {
            queryBuilder.andWhere('cxc.fecha >= :fechaInicio', {
                fechaInicio: new Date(filter.fechaInicio)
            });
        }
        else if (filter.fechaFin) {
            queryBuilder.andWhere('cxc.fecha <= :fechaFin', {
                fechaFin: new Date(filter.fechaFin)
            });
        }
        // Filtro por estado
        if (filter.estado) {
            queryBuilder.andWhere('cxc.estado = :estado', { estado: filter.estado });
        }
        // Filtro por empresa (obligatorio para vendedores)
        if (filter.empresaId) {
            queryBuilder.andWhere('cxc.empresa_id = :empresaId', {
                empresaId: filter.empresaId
            });
        }
        else if (req.user && req.user.empresaId) {
            // Si el usuario está autenticado y tiene empresa, filtrar por ella
            queryBuilder.andWhere('cxc.empresa_id = :empresaId', {
                empresaId: req.user.empresaId
            });
        }
        else {
            return res.status(400).json({
                message: 'Se requiere el ID de la empresa o el usuario debe estar autenticado'
            });
        }
        // Filtro por vendedor
        if (filter.vendedorId) {
            queryBuilder.andWhere('cliente.cven = :vendedorId', {
                vendedorId: filter.vendedorId
            });
        }
        else if (req.user?.vendedorId) {
            // Si el usuario es un vendedor, filtrar solo sus clientes
            queryBuilder.andWhere('cliente.cven = :vendedorId', {
                vendedorId: req.user.vendedorId
            });
        }
        // Filtro por cliente específico
        if (filter.clienteId) {
            queryBuilder.andWhere('cliente.codigo = :clienteId', {
                clienteId: filter.clienteId
            });
        }
        const cxcs = await queryBuilder.getMany();
        res.json(cxcs);
    }
    catch (error) {
        console.error('Error al obtener cuentas por cobrar:', error);
        res.status(500).json({
            message: 'Error al obtener las cuentas por cobrar',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getCxcs = getCxcs;
const getCxcById = async (req, res) => {
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    try {
        const { id } = req.params;
        // Corrección: Usar findOne en lugar de findOneBy si necesitas relaciones
        const cxc = await cxcRepository.findOne({
            where: { id: Number(id) },
            relations: ['cliente']
        });
        if (!cxc) {
            return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
        }
        res.json(cxc);
    }
    catch (error) {
        console.error('Error al obtener cuenta por cobrar:', error);
        res.status(500).json({
            message: 'Error al obtener la cuenta por cobrar',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getCxcById = getCxcById;
const createCxc = async (req, res) => {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        // Validar datos de entrada
        const { monto, clienteCodigo, empresaId } = req.body;
        if (!monto || monto <= 0) {
            return res.status(400).json({ message: 'El monto debe ser mayor a cero' });
        }
        if (!clienteCodigo) {
            return res.status(400).json({ message: 'El código de cliente es requerido' });
        }
        if (!empresaId) {
            return res.status(400).json({ message: 'El ID de empresa es requerido' });
        }
        // Verificar que el cliente existe
        const cliente = await clienteRepository.findOne({
            where: {
                codigo: clienteCodigo,
                empresaId: Number(empresaId)
            }
        });
        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente no encontrado para la empresa especificada'
            });
        }
        // Crear la entidad con los datos validados
        const cxcData = {
            ...req.body,
            fecha: new Date(),
            estado: 'pendiente',
            saldo: monto
        };
        const cxc = cxcRepository.create(cxcData);
        // --- CORRECCIÓN AQUÍ ---
        // Guardamos la entidad. No necesitamos capturar el retorno.
        // TypeORM asignará el nuevo 'id' al objeto 'cxc' original.
        await cxcRepository.save(cxc);
        await queryRunner.commitTransaction();
        // --- CORRECCIÓN AQUÍ ---
        // Usamos el 'id' del objeto 'cxc' original que ya fue poblado.
        const cxcConRelaciones = await cxcRepository.findOne({
            where: { id: cxc.id },
            relations: ['cliente']
        });
        res.status(201).json(cxcConRelaciones);
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error al crear cuenta por cobrar:', error);
        res.status(500).json({
            message: 'Error al crear la cuenta por cobrar',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
    finally {
        await queryRunner.release();
    }
};
exports.createCxc = createCxc;
const updateCxc = async (req, res) => {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const { id } = req.params;
        const cxc = await cxcRepository.findOne({
            where: { id: Number(id) },
            relations: ['cliente']
        });
        if (!cxc) {
            return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
        }
        const { id: _, clienteCodigo, fecha, empresaId, ...updateData } = req.body;
        if (updateData.estado === 'pagado' && !updateData.fechaPago) {
            updateData.fechaPago = new Date();
        }
        if (updateData.estado === 'pagado') {
            updateData.saldo = 0;
        }
        Object.assign(cxc, updateData);
        // --- CORRECCIÓN AQUÍ ---
        // Guardamos la entidad actualizada. El objeto 'cxc' sigue siendo la misma referencia.
        await cxcRepository.save(cxc);
        await queryRunner.commitTransaction();
        // --- CORRECCIÓN AQUÍ ---
        // Usamos el 'id' del objeto 'cxc' que ya tenemos.
        const cxcActualizado = await cxcRepository.findOne({
            where: { id: cxc.id },
            relations: ['cliente']
        });
        res.json(cxcActualizado);
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error al actualizar cuenta por cobrar:', error);
        res.status(500).json({
            message: 'Error al actualizar la cuenta por cobrar',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
    finally {
        await queryRunner.release();
    }
};
exports.updateCxc = updateCxc;
const deleteCxc = async (req, res) => {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const { id } = req.params;
        const cxc = await cxcRepository.findOneBy({ id: Number(id) });
        if (!cxc) {
            return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
        }
        if (cxc.estado === 'pagado') {
            return res.status(400).json({
                message: 'No se puede eliminar una cuenta por cobrar que ya ha sido pagada'
            });
        }
        // Volviendo a usar delete(id) que es más directo para esta operación
        const resultado = await cxcRepository.delete(id);
        if (resultado.affected === 0) {
            return res.status(404).json({ message: 'No se pudo eliminar la cuenta por cobrar' });
        }
        await queryRunner.commitTransaction();
        res.status(204).send();
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error al eliminar cuenta por cobrar:', error);
        res.status(500).json({
            message: 'Error al eliminar la cuenta por cobrar',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
    finally {
        await queryRunner.release();
    }
};
exports.deleteCxc = deleteCxc;
// Obtener cuentas por cobrar por cliente
const getCxcsByCliente = async (req, res) => {
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    const { clienteId } = req.params;
    const { empresaId, vendedorId } = req.query;
    try {
        const { estado, fechaInicio, fechaFin } = req.query;
        const where = {
            clienteCodigo: clienteId
        };
        // Filtrar por empresa si está presente
        if (empresaId) {
            where.empresaId = Number(empresaId);
        }
        // Filtrar por estado si está presente
        if (estado) {
            where.estado = estado;
        }
        // Filtrar por rango de fechas si están presentes
        if (fechaInicio && fechaFin) {
            where.fecha = (0, typeorm_1.Between)(new Date(fechaInicio), new Date(fechaFin));
        }
        const cxcs = await cxcRepository.find({
            where,
            relations: ['cliente'],
            order: { fecha: 'DESC' }
        });
        res.json(cxcs);
    }
    catch (error) {
        console.error('Error al obtener cuentas por cobrar del cliente:', error);
        res.status(500).json({
            message: 'Error al obtener las cuentas por cobrar del cliente',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getCxcsByCliente = getCxcsByCliente;
// Obtener resumen de cuentas por cobrar por cliente
const getResumenCxcsByCliente = async (req, res) => {
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    try {
        const { clienteId } = req.params;
        const { empresaId, vendedorId } = req.query;
        // Si el usuario es un vendedor, verificar que solo pueda ver sus clientes
        if (req.user?.vendedorId) {
            const cliente = await database_1.AppDataSource.getRepository(Cliente_1.Cliente).findOne({
                where: {
                    codigo: clienteId,
                    vendedorCodigo: req.user.vendedorId,
                    ...(empresaId ? { empresaId: Number(empresaId) } : {})
                }
            });
            if (!cliente) {
                return res.status(403).json({
                    message: 'No tiene permiso para ver este cliente'
                });
            }
        }
        const whereBase = {
            clienteCodigo: clienteId,
            ...(empresaId ? { empresaId: Number(empresaId) } : {})
        };
        // Si se proporciona vendedorId, filtrar por vendedor
        if (vendedorId) {
            whereBase.cliente = { vendedorCodigo: vendedorId };
        }
        const [pendientes, vencidas, pagadas] = await Promise.all([
            cxcRepository.find({
                where: {
                    ...whereBase,
                    estado: 'pendiente',
                    fechaVencimiento: (0, typeorm_1.MoreThan)(new Date())
                },
                select: ['id', 'monto', 'fechaVencimiento', 'tipoDocumento', 'numero']
            }),
            cxcRepository.find({
                where: {
                    ...whereBase,
                    estado: 'pendiente',
                    fechaVencimiento: (0, typeorm_1.LessThan)(new Date())
                },
                select: ['id', 'monto', 'fechaVencimiento', 'tipoDocumento', 'numero']
            }),
            cxcRepository.find({
                where: {
                    ...whereBase,
                    estado: 'pagado'
                },
                select: ['id', 'monto', 'fechaPago', 'tipoDocumento', 'numero']
            })
        ]);
        const totalPendiente = pendientes.reduce((sum, cxc) => sum + Number(cxc.monto), 0);
        const totalVencido = vencidas.reduce((sum, cxc) => sum + Number(cxc.monto), 0);
        const totalPagado = pagadas.reduce((sum, cxc) => sum + Number(cxc.monto), 0);
        res.json({
            resumen: {
                pendientes: {
                    cantidad: pendientes.length,
                    total: totalPendiente
                },
                vencidas: {
                    cantidad: vencidas.length,
                    total: totalVencido
                },
                pagadas: {
                    cantidad: pagadas.length,
                    total: totalPagado
                },
                totalGeneral: totalPendiente + totalVencido + totalPagado
            },
            detalle: {
                pendientes,
                vencidas,
                pagadas
            }
        });
    }
    catch (error) {
        console.error('Error al obtener resumen de cuentas por cobrar:', error);
        res.status(500).json({
            message: 'Error al obtener el resumen de cuentas por cobrar',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getResumenCxcsByCliente = getResumenCxcsByCliente;
// Obtener cuentas vencidas
const getCxcsVencidas = async (req, res) => {
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    try {
        const { empresaId } = req.query;
        const where = {
            estado: 'pendiente',
            fechaVencimiento: (0, typeorm_1.LessThan)(new Date())
        };
        if (empresaId) {
            where.empresaId = Number(empresaId);
        }
        const cxcsVencidas = await cxcRepository.find({
            where,
            relations: ['cliente'],
            order: { fechaVencimiento: 'ASC' }
        });
        res.json(cxcsVencidas);
    }
    catch (error) {
        console.error('Error al obtener cuentas vencidas:', error);
        res.status(500).json({
            message: 'Error al obtener las cuentas vencidas',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getCxcsVencidas = getCxcsVencidas;
// Obtener cuentas por vencer
const getCxcsPorVencer = async (req, res) => {
    const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
    try {
        const { empresaId, dias = 7 } = req.query;
        const hoy = new Date();
        const fechaLimite = new Date();
        fechaLimite.setDate(hoy.getDate() + Number(dias));
        const where = {
            estado: 'pendiente',
            fechaVencimiento: (0, typeorm_1.Between)(hoy, fechaLimite)
        };
        if (empresaId) {
            where.empresaId = Number(empresaId);
        }
        const cxcsPorVencer = await cxcRepository.find({
            where,
            relations: ['cliente'],
            order: { fechaVencimiento: 'ASC' }
        });
        res.json(cxcsPorVencer);
    }
    catch (error) {
        console.error('Error al obtener cuentas por vencer:', error);
        res.status(500).json({
            message: 'Error al obtener las cuentas por vencer',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getCxcsPorVencer = getCxcsPorVencer;
