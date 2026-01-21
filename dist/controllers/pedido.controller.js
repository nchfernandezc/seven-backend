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
    id: raw.pedido_internalId || raw.pedido_xxx || raw.xxx, // Frontend expects unique ID here
    empresaId: raw.pedido_id || raw.id,
    num: raw.pedido_num || raw.num,
    ven: raw.pedido_ven || raw.ven,
    cod: raw.pedido_cod || raw.cod,
    des: raw.pedido_des || raw.des,
    cli: raw.pedido_cli || raw.cli,
    can: raw.pedido_can || raw.can,
    pre: raw.pedido_pre || raw.pre,
    fecha: raw.pedido_dfec || raw.dfec,
    estado: raw.pedido_itip || raw.itip,
    // Map relationships with safe access
    cliente: {
        ccod: raw.cliente_ccod || raw.cli_ccod || '',
        cdet: raw.cliente_cdet || raw.cli_cdet || 'Cliente Desconocido',
        cdir: raw.cliente_cdir || raw.cli_cdir || '',
        ctel: raw.cliente_ctel || raw.cli_ctel || ''
    },
    articulo: {
        ccod: raw.articulo_ccod || raw.art_ccod || '',
        cdet: raw.articulo_cdet || raw.art_cdet || 'Articulo Desconocido',
        npre1: raw.articulo_npre1 || raw.art_npre1 || 0
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
        // Use raw query with manual aliases to avoid collisions
        // Assuming columns: pedido(num, ven, cod, des, can, pre, cli, id, dfec, itip, xxx)
        const sql = `
      SELECT 
        pedido.xxx AS pedido_internalId,
        pedido.id AS pedido_id,
        pedido.num AS pedido_num,
        pedido.ven AS pedido_ven,
        pedido.cod AS pedido_cod,
        pedido.des AS pedido_des,
        pedido.can AS pedido_can,
        pedido.pre AS pedido_pre,
        pedido.cli AS pedido_cli,
        pedido.dfec AS pedido_dfec,
        pedido.itip AS pedido_itip,
        cliente.ccod AS cliente_ccod,
        cliente.cdet AS cliente_cdet,
        cliente.cdir AS cliente_cdir,
        cliente.ctel AS cliente_ctel,
        articulo.ccod AS articulo_ccod,
        articulo.cdet AS articulo_cdet,
        articulo.npre1 AS articulo_npre1
      FROM \`${tableName}\` pedido
      LEFT JOIN \`${clienteTable}\` cliente ON pedido.cli = cliente.ccod AND cliente.id = ?
      LEFT JOIN \`${articuloTable}\` articulo ON pedido.cod = articulo.ccod AND articulo.id = ?
      WHERE pedido.id = ?
      ORDER BY pedido.dfec DESC
    `;
        const rawPedidos = await database_1.AppDataSource.query(sql, [empresaId, empresaId, empresaId]);
        console.log('[getPedidos] Raw result:', rawPedidos);
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
            .addSelect(['cliente.ccod', 'cliente.cdet', 'cliente.cdir', 'cliente.ctel'])
            .addSelect(['articulo.ccod', 'articulo.cdet', 'articulo.npre1'])
            .from(tableName, 'pedido')
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
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
            .select('1')
            .from(clienteTable, 'cliente')
            .where('cliente.ccod = :codigo', { codigo: req.body.cli })
            .andWhere('cliente.id = :empresaId', { empresaId })
            .getRawOne();
        if (!cliente) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Verificar artículo
        const articulo = await queryRunner.manager.createQueryBuilder()
            .select('1')
            .from(articuloTable, 'articulo')
            .where('articulo.ccod = :codigo', { codigo: req.body.cod })
            .andWhere('articulo.id = :empresaId', { empresaId })
            .getRawOne();
        if (!articulo) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        // Calcular total
        const total = req.body.can * req.body.pre;
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
            num: req.body.num || `PED-${Date.now()}`,
            ven: req.user?.vendedorId || 'VEN001',
            cod: req.body.cod,
            des: req.body.des || 'DESCRIPCION',
            can: req.body.can,
            pre: req.body.pre,
            cli: req.body.cli,
            id: empresaId,
            dfec: new Date(),
            itip: 1
        })
            .execute();
        const newPedidoId = insertPedido.raw.insertId;
        // Crear cuenta por cobrar
        // Get last CXC num
        const lastCxcResults = await queryRunner.query(`SELECT inum FROM \`${cxcTable}\` WHERE id = ? ORDER BY inum DESC LIMIT 1`, [empresaId]);
        const lastCxc = lastCxcResults[0];
        // cxc.inum is likely mapped to 'numero' property
        const nextNumero = lastCxc ? (lastCxc.inum) + 1 : 1;
        // Note: raw result keys depend on driver. Usually just 'inum'. 
        await queryRunner.manager.createQueryBuilder()
            .insert()
            .into(cxcTable)
            .values({
            cdoc: 'PED',
            inum: nextNumero,
            nsal: total,
            ccli: req.body.cli,
            dfec: new Date(),
            // fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // No 'dven' in this raw insert? If so use 'dven' if entity has it. Cxcobrar.ts says 'dven' is not in User's removed list? Wait, user removed dven in their edit?
            // User edit to Cxcobrar REMOVED 'dven'. But user requested earlier to add it? No, user requested "adjust entities headers".
            // Let's check user's Cxcobrar edit. 'dven' was commented out or removed?
            // "dven" was NOT in the list of kept columns. Only 'id', 'cdoc', 'inum', 'dfec', 'nsal', 'ccli', 'ista', 'cven'.
            // So we do not insert dven.
            ista: 0,
            cven: req.user?.vendedorId || 'VEN001',
            id: empresaId
        })
            .execute();
        await queryRunner.commitTransaction();
        // Obtener pedido con relaciones para respuesta
        const queryBuilder = database_1.AppDataSource.createQueryBuilder()
            .select('pedido.*')
            .addSelect('cliente.*')
            .addSelect('articulo.*')
            .from(pedidoTable, 'pedido')
            .leftJoin(clienteTable, 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
            .leftJoin(articuloTable, 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
            .where('pedido.xxx = :id', { id: Number(newPedidoId) });
        const rawPedidoCreado = await queryBuilder.getRawOne();
        const pedidoCreado = mapRawToPedido(rawPedidoCreado);
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
        const pedidoExistente = await database_1.AppDataSource.createQueryBuilder()
            .from(tableName, 'pedido')
            .where('pedido.xxx = :id', { id: Number(id) })
            .andWhere('pedido.id = :empresaId', { empresaId })
            .getRawOne();
        if (!pedidoExistente) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        // Checking foreign keys if updating
        // Checking foreign keys if updating
        if (req.body.cli) {
            const exists = await database_1.AppDataSource.createQueryBuilder()
                .select('1')
                .from((0, tableName_1.getTableName)(empresaId, 'cliente'), 'c')
                .where('c.ccod = :cod', { cod: req.body.cli })
                .andWhere('c.id = :eid', { eid: empresaId })
                .getRawOne();
            if (!exists)
                return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // ... same for articulo if needed
        await database_1.AppDataSource.createQueryBuilder()
            .update(tableName)
            .set(req.body)
            .where('xxx = :id', { id: Number(id) })
            .andWhere('id = :empresaId', { empresaId })
            .execute();
        const queryBuilder = database_1.AppDataSource.createQueryBuilder()
            .select('pedido.*')
            .addSelect('cliente.*')
            .addSelect('articulo.*')
            .from(tableName, 'pedido')
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
            .where('pedido.xxx = :id', { id: Number(id) });
        const rawPedidoActualizado = await queryBuilder.getRawOne();
        const pedidoActualizado = mapRawToPedido(rawPedidoActualizado);
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
        const resultado = await database_1.AppDataSource.createQueryBuilder()
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
        const queryBuilder = database_1.AppDataSource.createQueryBuilder()
            .select('pedido.*')
            .addSelect('cliente.*')
            .addSelect('articulo.*')
            .from(tableName, 'pedido')
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
            .where('pedido.cli = :clienteId', { clienteId })
            .andWhere('pedido.id = :empresaId', { empresaId })
            .orderBy('pedido.dfec', 'DESC');
        const rawPedidos = await queryBuilder.getRawMany();
        const pedidos = rawPedidos.map(mapRawToPedido);
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
        const queryBuilder = database_1.AppDataSource.createQueryBuilder()
            .select('pedido.*')
            .addSelect('cliente.*')
            .addSelect('articulo.*')
            .from(tableName, 'pedido')
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
            .leftJoin((0, tableName_1.getTableName)(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
            .where('pedido.cod = :articuloCodigo', { articuloCodigo })
            .andWhere('pedido.id = :empresaId', { empresaId })
            .orderBy('pedido.dfec', 'DESC');
        const rawPedidos = await queryBuilder.getRawMany();
        const pedidos = rawPedidos.map(mapRawToPedido);
        res.json(pedidos);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener pedidos por artículo:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos del artículo', error: errorMessage });
    }
};
exports.getPedidosByArticulo = getPedidosByArticulo;
