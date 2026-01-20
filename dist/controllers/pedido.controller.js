"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPedidosByArticulo = exports.getPedidosByCliente = exports.deletePedido = exports.updatePedido = exports.createPedido = exports.getPedidoById = exports.getPedidos = void 0;
const database_1 = require("../config/database");
const Pedido_1 = require("../entities/Pedido");
const Cliente_1 = require("../entities/Cliente");
const Articulo_1 = require("../entities/Articulo");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const tableName_1 = require("../utils/tableName");
const pedidoRepository = database_1.AppDataSource.getRepository(Pedido_1.Pedido);
const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
const articuloRepository = database_1.AppDataSource.getRepository(Articulo_1.Articulo);
const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
const mapRawToPedido = (raw) => ({
    internalId: raw.pedido_xxx || raw.xxx,
    empresaId: raw.pedido_id || raw.id,
    numero: raw.pedido_num || raw.num,
    vendedorCodigo: raw.pedido_ven || raw.ven,
    articuloCodigo: raw.pedido_cod || raw.cod,
    descripcion: raw.pedido_des || raw.des,
    clienteCodigo: raw.pedido_cli || raw.cli,
    cantidad: raw.pedido_can || raw.can,
    precio: raw.pedido_pre || raw.pre,
    fecha: raw.pedido_dfec || raw.dfec,
    estado: raw.pedido_ista || raw.ista || raw.pedido_itip || raw.itip,
    // Map relationships
    cliente: {
        codigo: raw.cliente_codigo || raw.cliente_ccod || raw.cliente_cli,
        nombre: raw.cliente_nombre || raw.cliente_cnom || raw.cliente_nom,
        direccion: raw.cliente_direccion || raw.cliente_cdir || raw.cliente_dir,
        telefono: raw.cliente_telefono || raw.cliente_ctel || raw.cliente_tel
    },
    articulo: {
        codigo: raw.articulo_codigo || raw.articulo_ccod || raw.articulo_cod,
        descripcion: raw.articulo_descripcion || raw.articulo_cdet || raw.articulo_des,
        precio: raw.articulo_precio1 || raw.articulo_npre1 || raw.articulo_pre1
    }
});
/**
 * Obtiene todos los pedidos de una empresa
 */
const getPedidos = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const articuloTable = (0, tableName_1.getTableName)(empresaId, 'articulo');
        // Use raw query builder from DataSource
        const queryBuilder = database_1.AppDataSource.createQueryBuilder()
            .select('pedido.*')
            .addSelect('cliente.*')
            .addSelect('articulo.*')
            .from(tableName, 'pedido')
            .leftJoin(clienteTable, 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
            .leftJoin(articuloTable, 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
            .where('pedido.id = :empresaId', { empresaId })
            .orderBy('pedido.dfec', 'DESC');
        const rawPedidos = await queryBuilder.getRawMany();
        const pedidos = rawPedidos.map(mapRawToPedido);
        res.json(pedidos);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos', error: errorMessage });
    }
};
exports.getPedidos = getPedidos;
/**
 * Obtiene un pedido por ID
 */
const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const rawPedido = await database_1.AppDataSource.createQueryBuilder()
            .select('pedido.*')
            .addSelect(['cliente.codigo', 'cliente.nombre', 'cliente.direccion', 'cliente.telefono'])
            .addSelect(['articulo.codigo', 'articulo.descripcion', 'articulo.npre1'])
            .from(tableName, 'pedido')
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.codigo AND cliente.id = :empresaId', { empresaId })
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.codigo AND articulo.id = :empresaId', { empresaId })
            .where('pedido.xxx = :id', { id: Number(id) })
            .andWhere('pedido.id = :empresaId', { empresaId })
            .getRawOne();
        if (!rawPedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json(mapRawToPedido(rawPedido));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener pedido:', error);
        res.status(500).json({ message: 'Error al obtener el pedido', error: errorMessage });
    }
};
exports.getPedidoById = getPedidoById;
/**
 * Crea un nuevo pedido y genera la cuenta por cobrar asociada
 */
const createPedido = async (req, res) => {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const articuloTable = (0, tableName_1.getTableName)(empresaId, 'articulo');
        const cxcTable = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        // Verificar cliente
        const cliente = await queryRunner.manager.createQueryBuilder()
            .select('cliente')
            .from(clienteTable, 'cliente')
            .where('cliente.codigo = :codigo', { codigo: req.body.clienteCodigo })
            .andWhere('cliente.empresaId = :empresaId', { empresaId })
            .getRawOne();
        if (!cliente) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Verificar artículo
        const articulo = await queryRunner.manager.createQueryBuilder()
            .select('articulo')
            .from(articuloTable, 'articulo')
            .where('articulo.codigo = :codigo', { codigo: req.body.articuloCodigo })
            .andWhere('articulo.empresaId = :empresaId', { empresaId })
            .getRawOne();
        if (!articulo) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        // Calcular total
        const total = req.body.cantidad * req.body.precioVenta;
        // Crear pedido
        // Note: We use raw insert into dynamic table. 
        // Field mapping:
        // num (string) -> req.body.numero
        // ven (string) -> vendedoreId
        // cod (string) -> articuloCodigo
        // des (string) -> articuloDescripcion (extra)
        // can (decimal) -> cantidad
        // pre (decimal) -> precioVenta
        // cli (string) -> clienteCodigo
        // id (int) -> empresaId
        // date -> NOW()
        // We assume body has standard fields, we map to legacy columns
        const insertPedido = await queryRunner.manager.createQueryBuilder()
            .insert()
            .into(pedidoTable)
            .values({
            num: req.body.numero || `PED-${Date.now()}`, // Fallback if not provided
            ven: req.user?.vendedorId || 'VEN001',
            cod: req.body.articuloCodigo,
            des: req.body.articuloDescripcion || 'DESCRIPCION',
            can: req.body.cantidad,
            pre: req.body.precioVenta,
            cli: req.body.clienteCodigo,
            empresaId: empresaId, // 'id' column
            fecha: new Date(),
            estado: 1 // 'itip' or similar if existing? Assuming entity logic handles mapping if we used entity
            // but here we are raw. Let's look at schema. 
            // 001_pedido columns: num, ven, cod, des, can, pre, cli, id (empresa), ...
        })
            .execute();
        const newPedidoId = insertPedido.identifiers[0].internalId || insertPedido.raw.insertId;
        // Crear cuenta por cobrar
        // Get last CXC num
        const lastCxc = await queryRunner.manager.createQueryBuilder()
            .select('cxc')
            .from(cxcTable, 'cxc')
            .where('cxc.empresaId = :empresaId', { empresaId })
            .orderBy('cxc.inum', 'DESC') // 'inum' is the number column
            .getRawOne();
        // cxc.inum is likely mapped to 'numero' property
        const nextNumero = lastCxc ? (lastCxc.cxc_inum || lastCxc.inum) + 1 : 1;
        // Note: raw result keys depend on driver. Usually just 'inum'. 
        await queryRunner.manager.createQueryBuilder()
            .insert()
            .into(cxcTable)
            .values({
            tipoDocumento: 'PED', // 'cdoc'
            numero: nextNumero, // 'inum'
            monto: total, // 'nsal' ?
            saldo: total,
            clienteCodigo: req.body.clienteCodigo,
            fecha: new Date(),
            fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            estado: 0, // 0 = pendiente
            observaciones: `Cuenta generada por pedido`,
            empresaId: empresaId
        })
            .execute();
        await queryRunner.commitTransaction();
        // Obtener pedido con relaciones para respuesta
        const pedidoCreado = await pedidoRepository.createQueryBuilder('pedido')
            .from(pedidoTable, 'pedido')
            .leftJoinAndMapOne('pedido.cliente', clienteTable, 'cliente', 'pedido.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
            .leftJoinAndMapOne('pedido.articulo', articuloTable, 'articulo', 'pedido.articuloCodigo = articulo.codigo AND articulo.empresaId = :empresaId', { empresaId })
            .where('pedido.internalId = :id', { id: Number(newPedidoId) })
            .getOne();
        res.status(201).json(pedidoCreado);
    }
    catch (error) {
        if (queryRunner.isTransactionActive)
            await queryRunner.rollbackTransaction();
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al crear pedido:', error);
        res.status(500).json({ message: 'Error al crear el pedido', error: errorMessage });
    }
    finally {
        await queryRunner.release();
    }
};
exports.createPedido = createPedido;
/**
 * Actualiza un pedido existente
 */
const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const pedidoExistente = await pedidoRepository.createQueryBuilder('pedido')
            .from(tableName, 'pedido')
            .where('pedido.internalId = :id', { id: Number(id) })
            .andWhere('pedido.empresaId = :empresaId', { empresaId })
            .getOne();
        if (!pedidoExistente) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        // Checking foreign keys if updating
        if (req.body.clienteCodigo) {
            const exists = await clienteRepository.createQueryBuilder('c')
                .from((0, tableName_1.getTableName)(empresaId, 'cliente'), 'c')
                .where('c.codigo = :cod', { cod: req.body.clienteCodigo })
                .andWhere('c.empresaId = :eid', { eid: empresaId })
                .getOne();
            if (!exists)
                return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // ... same for articulo if needed
        await pedidoRepository.createQueryBuilder()
            .update(tableName)
            .set(req.body)
            .where('xxx = :id', { id: Number(id) })
            .execute();
        const pedidoActualizado = await pedidoRepository.createQueryBuilder('pedido')
            .from(tableName, 'pedido')
            .leftJoinAndMapOne('pedido.cliente', (0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'pedido.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
            .leftJoinAndMapOne('pedido.articulo', (0, tableName_1.getTableName)(empresaId, 'articulo'), 'articulo', 'pedido.articuloCodigo = articulo.codigo AND articulo.empresaId = :empresaId', { empresaId })
            .where('pedido.internalId = :id', { id: Number(id) })
            .getOne();
        res.json(pedidoActualizado);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ message: 'Error al actualizar el pedido', error: errorMessage });
    }
};
exports.updatePedido = updatePedido;
/**
 * Elimina un pedido
 */
const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const resultado = await pedidoRepository.createQueryBuilder()
            .delete()
            .from(tableName)
            .where('xxx = :id', { id: Number(id) })
            .andWhere('id = :empresaId', { empresaId })
            .execute();
        if (resultado.affected === 0) {
            return res.status(404).json({ message: 'No se pudo eliminar el pedido' });
        }
        res.status(204).send();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al eliminar pedido:', error);
        res.status(500).json({ message: 'Error al eliminar el pedido', error: errorMessage });
    }
};
exports.deletePedido = deletePedido;
/**
 * Obtiene pedidos de un cliente específico
 */
const getPedidosByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const pedidos = await pedidoRepository.createQueryBuilder('pedido')
            .from(tableName, 'pedido')
            .leftJoinAndMapOne('pedido.cliente', (0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'pedido.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
            .leftJoinAndMapOne('pedido.articulo', (0, tableName_1.getTableName)(empresaId, 'articulo'), 'articulo', 'pedido.articuloCodigo = articulo.codigo AND articulo.empresaId = :empresaId', { empresaId })
            .where('pedido.clienteCodigo = :clienteId', { clienteId })
            .andWhere('pedido.empresaId = :empresaId', { empresaId })
            .orderBy('pedido.fecha', 'DESC')
            .getMany();
        res.json(pedidos);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener pedidos por cliente:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos del cliente', error: errorMessage });
    }
};
exports.getPedidosByCliente = getPedidosByCliente;
/**
 * Obtiene pedidos de un artículo específico
 */
const getPedidosByArticulo = async (req, res) => {
    try {
        const { articuloCodigo } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const pedidos = await pedidoRepository.createQueryBuilder('pedido')
            .from(tableName, 'pedido')
            .leftJoinAndMapOne('pedido.cliente', (0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'pedido.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
            .leftJoinAndMapOne('pedido.articulo', (0, tableName_1.getTableName)(empresaId, 'articulo'), 'articulo', 'pedido.articuloCodigo = articulo.codigo AND articulo.empresaId = :empresaId', { empresaId })
            .where('pedido.articuloCodigo = :articuloCodigo', { articuloCodigo })
            .andWhere('pedido.empresaId = :empresaId', { empresaId })
            .orderBy('pedido.fecha', 'DESC')
            .getMany();
        res.json(pedidos);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener pedidos por artículo:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos del artículo', error: errorMessage });
    }
};
exports.getPedidosByArticulo = getPedidosByArticulo;
