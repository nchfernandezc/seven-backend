"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCxcsPorVencer = exports.getCxcsVencidas = exports.getResumenCxcsByCliente = exports.getCxcsByCliente = exports.deleteCxc = exports.updateCxc = exports.createCxc = exports.getCxcById = exports.getCxcs = void 0;
const database_1 = require("../config/database");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const Cliente_1 = require("../entities/Cliente");
const tableName_1 = require("../utils/tableName");
const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
const mapRawToCxc = (raw) => ({
    internalId: raw.cxc_xxx || raw.xxx,
    empresaId: raw.cxc_id || raw.id,
    tipoDocumento: raw.cxc_cdoc || raw.cdoc,
    clienteCodigo: raw.cxc_ccli || raw.ccli,
    numero: raw.cxc_inum || raw.inum,
    monto: Number(raw.cxc_impo || raw.impo || (Number(raw.cxc_nnet || raw.nnet || 0) + Number(raw.cxc_niva || raw.niva || 0))),
    nnet: raw.cxc_nnet || raw.nnet,
    niva: raw.cxc_niva || raw.niva,
    fecha: raw.cxc_dfec || raw.dfec,
    saldo: raw.cxc_nsal || raw.nsal,
    dias: raw.cxc_idia || raw.idia,
    estado: (raw.cxc_ista === 1 || raw.ista === 1) ? 'pagado' : 'pendiente',
    // Map joined client data if available
    // Check for both 'codigo' (modern) and 'ccod' (legacy) aliases
    cliente: (raw.cliente_codigo || raw.cliente_ccod) ? {
        internalId: raw.cliente_xxx,
        codigo: raw.cliente_codigo || raw.cliente_ccod,
        nombre: raw.cliente_nombre || raw.cliente_cnom || raw.cliente_nom,
        direccion: raw.cliente_direccion || raw.cliente_cdir || raw.cliente_dir,
        telefono: raw.cliente_telefono || raw.cliente_ctel || raw.cliente_tel,
        vendedorCodigo: raw.cliente_vendedorCodigo || raw.cliente_cven
    } : undefined
});
/**
 * Obtiene todas las cuentas por cobrar con filtros opcionales
 */
const getCxcs = async (req, res) => {
    try {
        const filter = req.query;
        // Prefer req.user.empresaId if available (secure), otherwise query param if allowed
        const empresaId = req.user?.empresaId || (filter.empresaId ? Number(filter.empresaId) : undefined);
        if (!empresaId) {
            return res.status(400).json({ message: 'Se requiere el ID de la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        // Use raw query builder from DataSource
        const queryBuilder = database_1.AppDataSource.createQueryBuilder()
            .select('cxc.*')
            .addSelect('cliente.*')
            .from(tableName, 'cxc')
            .leftJoin(clienteTable, 'cliente', 'cxc.ccli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
            .where('cxc.id = :empresaId', { empresaId })
            .orderBy('cxc.dfec', 'DESC');
        // Filter logic adaptable to raw query (using column names)
        if (filter.fechaInicio && filter.fechaFin) {
            queryBuilder.andWhere('cxc.dfec BETWEEN :fechaInicio AND :fechaFin', {
                fechaInicio: new Date(filter.fechaInicio),
                fechaFin: new Date(filter.fechaFin)
            });
        }
        else if (filter.fechaInicio) {
            queryBuilder.andWhere('cxc.dfec >= :fechaInicio', {
                fechaInicio: new Date(filter.fechaInicio)
            });
        }
        else if (filter.fechaFin) {
            queryBuilder.andWhere('cxc.dfec <= :fechaFin', {
                fechaFin: new Date(filter.fechaFin)
            });
        }
        if (filter.estado) {
            // Map 'pagado'/'pendiente' to 1/0
            const estadoVal = filter.estado === 'pagado' ? 1 : 0;
            queryBuilder.andWhere('cxc.ista = :estado', { estado: estadoVal });
        }
        const vendedorId = req.user?.vendedorId || filter.vendedorId;
        if (vendedorId) {
            // 'cven' in cliente table
            queryBuilder.andWhere('cliente.cven = :vendedorId', { vendedorId });
        }
        if (filter.clienteId) {
            queryBuilder.andWhere('cliente.codigo = :clienteId', { clienteId: filter.clienteId });
        }
        const rawCxcs = await queryBuilder.getRawMany();
        // Map raw results due to join aliases
        // getRawMany with alias returns cxc_column, cliente_column
        // We update mapper to handle this
        const cxcs = rawCxcs.map(raw => mapRawToCxc({
            ...raw,
            // Manual helpers for the mapper which expects specific structure or prefixes
            // Raw returns `cxc_xxx`, `cliente_nombre`, etc.
            // We ensure mapper handles them.
        }));
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
/**
 * Obtiene una cuenta por cobrar por ID
 */
const getCxcById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        // Use Raw Query
        const rawCxc = await database_1.AppDataSource.createQueryBuilder()
            .select('cxc.*')
            .addSelect('cliente.*')
            .from(tableName, 'cxc')
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'cxc.ccli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
            .where('cxc.xxx = :id', { id: Number(id) })
            .andWhere('cxc.id = :empresaId', { empresaId })
            .getRawOne();
        if (!rawCxc) {
            return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
        }
        res.json(mapRawToCxc(rawCxc));
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
/**
 * Crea una nueva cuenta por cobrar
 */
const createCxc = async (req, res) => {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    try {
        const { monto, clienteCodigo, empresaId } = req.body;
        const finalEmpresaId = req.user?.empresaId || empresaId;
        if (!monto || monto <= 0) {
            return res.status(400).json({ message: 'El monto debe ser mayor a cero' });
        }
        if (!clienteCodigo) {
            return res.status(400).json({ message: 'El código de cliente es requerido' });
        }
        if (!finalEmpresaId) {
            return res.status(400).json({ message: 'El ID de empresa es requerido' });
        }
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const clienteTable = (0, tableName_1.getTableName)(finalEmpresaId, 'cliente');
        const cxcTable = (0, tableName_1.getTableName)(finalEmpresaId, 'cxcobrar');
        // Verificar cliente
        const cliente = await queryRunner.manager.createQueryBuilder()
            .select('cliente')
            .from(clienteTable, 'cliente')
            .where('cliente.codigo = :codigo', { codigo: clienteCodigo })
            .andWhere('cliente.empresaId = :empresaId', { empresaId: finalEmpresaId })
            .getRawOne();
        if (!cliente) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Insertar
        const insertResult = await queryRunner.manager.createQueryBuilder()
            .insert()
            .into(cxcTable)
            .values({
            ...req.body,
            fecha: new Date(),
            estado: 'pendiente',
            saldo: monto,
            empresaId: finalEmpresaId
        })
            .execute();
        await queryRunner.commitTransaction();
        const newId = insertResult.identifiers[0].internalId || insertResult.raw.insertId;
        const cxcConRelaciones = await cxcRepository.createQueryBuilder('cxc')
            .from(cxcTable, 'cxc')
            .leftJoinAndMapOne('cxc.cliente', clienteTable, 'cliente', 'cxc.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId: finalEmpresaId })
            .where('cxc.internalId = :id', { id: Number(newId) })
            .getOne();
        res.status(201).json(cxcConRelaciones);
    }
    catch (error) {
        if (queryRunner.isTransactionActive)
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
/**
 * Actualiza una cuenta por cobrar existente
 */
const updateCxc = async (req, res) => {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const cxc = await cxcRepository.createQueryBuilder('cxc')
            .from(tableName, 'cxc')
            .where('cxc.internalId = :id', { id: Number(id) })
            .andWhere('cxc.empresaId = :empresaId', { empresaId })
            .getOne();
        if (!cxc) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
        }
        const { id: _, clienteCodigo, fecha, empresaId: __, ...updateData } = req.body;
        // Si se marca como pagado
        if (updateData.estado === 'pagado') {
            updateData.saldo = 0;
        }
        await queryRunner.manager.createQueryBuilder()
            .update(tableName)
            .set({
            ...updateData,
            // We must transform 'pagado' -> 1 if we are using raw update, 
            // because transformers only work on Entity save/find.
            estado: updateData.estado === 'pagado' ? 1 : 0
        })
            .where('xxx = :id', { id: Number(id) })
            .execute();
        await queryRunner.commitTransaction();
        const cxcActualizado = await cxcRepository.createQueryBuilder('cxc')
            .from(tableName, 'cxc')
            .leftJoinAndMapOne('cxc.cliente', (0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'cxc.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
            .where('cxc.internalId = :id', { id: Number(id) })
            .getOne();
        res.json(cxcActualizado);
    }
    catch (error) {
        if (queryRunner.isTransactionActive)
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
/**
 * Elimina una cuenta por cobrar
 */
const deleteCxc = async (req, res) => {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        await queryRunner.connect();
        // Assuming delete is atomic enough or we need to check constraints, transaction is good practice
        await queryRunner.startTransaction();
        const cxc = await cxcRepository.createQueryBuilder('cxc')
            .from(tableName, 'cxc')
            .where('cxc.internalId = :id', { id: Number(id) })
            .andWhere('cxc.empresaId = :empresaId', { empresaId })
            .getOne();
        if (!cxc) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
        }
        if (cxc.estado === 'pagado') {
            await queryRunner.rollbackTransaction();
            return res.status(400).json({
                message: 'No se puede eliminar una cuenta pagada'
            });
        }
        const result = await queryRunner.manager.createQueryBuilder()
            .delete()
            .from(tableName)
            .where('xxx = :id', { id: Number(id) })
            .execute();
        if (result.affected === 0) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: 'No se pudo eliminar la cuenta' });
        }
        await queryRunner.commitTransaction();
        res.status(204).send();
    }
    catch (error) {
        if (queryRunner.isTransactionActive)
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
/**
 * Obtiene cuentas por cobrar de un cliente específico
 */
const getCxcsByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const filter = req.query;
        const empresaId = req.user?.empresaId || (filter.empresaId ? Number(filter.empresaId) : undefined);
        if (!empresaId) {
            return res.status(400).json({ message: 'Se requiere el ID de la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const queryBuilder = cxcRepository.createQueryBuilder('cxc')
            .from(tableName, 'cxc')
            .leftJoinAndMapOne('cxc.cliente', clienteTable, 'cliente', 'cxc.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
            .where('cxc.clienteCodigo = :clienteId', { clienteId })
            .andWhere('cxc.empresaId = :empresaId', { empresaId })
            .orderBy('cxc.fecha', 'DESC');
        if (filter.estado) {
            queryBuilder.andWhere('cxc.estado = :estado', { estado: filter.estado });
        }
        if (filter.fechaInicio && filter.fechaFin) {
            queryBuilder.andWhere('cxc.fecha BETWEEN :fi AND :ff', {
                fi: new Date(filter.fechaInicio),
                ff: new Date(filter.fechaFin)
            });
        }
        const cxcs = await queryBuilder.getMany();
        res.json(cxcs);
    }
    catch (error) {
        console.error('Error al obtener cuentas del cliente:', error);
        res.status(500).json({
            message: 'Error al obtener las cuentas del cliente',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getCxcsByCliente = getCxcsByCliente;
/**
 * Obtiene resumen de cuentas por cobrar de un cliente
 */
const getResumenCxcsByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const { empresaId: queryEmpresaId } = req.query;
        const empresaId = req.user?.empresaId || (queryEmpresaId ? Number(queryEmpresaId) : undefined);
        if (!empresaId) {
            return res.status(403).json({ message: 'Empresa ID requerido' });
        }
        const cxcTable = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const baseQuery = cxcRepository.createQueryBuilder('cxc')
            .from(cxcTable, 'cxc')
            .where('cxc.clienteCodigo = :clienteId', { clienteId })
            .andWhere('cxc.empresaId = :empresaId', { empresaId });
        // Clonamos queries para distintos estados
        const qPendientes = baseQuery.clone().andWhere("cxc.estado = 'pendiente' AND cxc.fechaVencimiento > NOW()");
        const qVencidas = baseQuery.clone().andWhere("cxc.estado = 'pendiente' AND cxc.fechaVencimiento <= NOW()");
        const qPagadas = baseQuery.clone().andWhere("cxc.estado = 'pagado'");
        const [pendientes, vencidas, pagadas] = await Promise.all([
            qPendientes.getMany(),
            qVencidas.getMany(),
            qPagadas.getMany()
        ]);
        const totalPendiente = pendientes.reduce((sum, cxc) => sum + Number(cxc.monto), 0);
        const totalVencido = vencidas.reduce((sum, cxc) => sum + Number(cxc.monto), 0);
        const totalPagado = pagadas.reduce((sum, cxc) => sum + Number(cxc.monto), 0);
        res.json({
            resumen: {
                pendientes: { cantidad: pendientes.length, total: totalPendiente },
                vencidas: { cantidad: vencidas.length, total: totalVencido },
                pagadas: { cantidad: pagadas.length, total: totalPagado },
                totalGeneral: totalPendiente + totalVencido + totalPagado
            },
            detalle: { pendientes, vencidas, pagadas }
        });
    }
    catch (error) {
        console.error('Error al obtener resumen:', error);
        res.status(500).json({
            message: 'Error al obtener el resumen',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getResumenCxcsByCliente = getResumenCxcsByCliente;
/**
 * Obtiene cuentas vencidas
 */
const getCxcsVencidas = async (req, res) => {
    try {
        const { empresaId: queryEmpresaId } = req.query;
        const empresaId = req.user?.empresaId || (queryEmpresaId ? Number(queryEmpresaId) : undefined);
        if (!empresaId)
            return res.status(400).json({ message: 'Empresa ID requerido' });
        const table = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const cxcs = await cxcRepository.createQueryBuilder('cxc')
            .from(table, 'cxc')
            .leftJoinAndMapOne('cxc.cliente', (0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'cxc.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
            .where('cxc.estado = :estado', { estado: 'pendiente' })
            .andWhere('cxc.fechaVencimiento < NOW()')
            .andWhere('cxc.empresaId = :empresaId', { empresaId })
            .orderBy('cxc.fechaVencimiento', 'ASC')
            .getMany();
        res.json(cxcs);
    }
    catch (error) {
        console.error('Error al obtener cuentas vencidas:', error);
        res.status(500).json({ message: 'Error', error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};
exports.getCxcsVencidas = getCxcsVencidas;
/**
 * Obtiene cuentas próximas a vencer
 */
const getCxcsPorVencer = async (req, res) => {
    try {
        const { dias = 7, empresaId: queryEmpresaId } = req.query;
        const empresaId = req.user?.empresaId || (queryEmpresaId ? Number(queryEmpresaId) : undefined);
        if (!empresaId)
            return res.status(400).json({ message: 'Empresa ID requerido' });
        const hoy = new Date();
        const fechaLimite = new Date();
        fechaLimite.setDate(hoy.getDate() + Number(dias));
        const table = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const cxcs = await cxcRepository.createQueryBuilder('cxc')
            .from(table, 'cxc')
            .leftJoinAndMapOne('cxc.cliente', (0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'cxc.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
            .where('cxc.estado = :estado', { estado: 'pendiente' })
            .andWhere('cxc.fechaVencimiento BETWEEN :hoy AND :limite', { hoy, limite: fechaLimite })
            .andWhere('cxc.empresaId = :empresaId', { empresaId })
            .orderBy('cxc.fechaVencimiento', 'ASC')
            .getMany();
        res.json(cxcs);
    }
    catch (error) {
        console.error('Error al obtener cuentas por vencer:', error);
        res.status(500).json({ message: 'Error', error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};
exports.getCxcsPorVencer = getCxcsPorVencer;
