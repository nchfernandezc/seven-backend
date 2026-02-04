"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPedidosByCliente = exports.getPedidoById = exports.createPedido = exports.getPedidos = void 0;
const database_1 = require("../config/database");
const tableName_1 = require("../utils/tableName");
/**
 * Obtiene todos los pedidos con sus relaciones
 */
const getPedidos = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId)
            return res.status(403).json({ message: 'Empresa no identificada' });
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const articuloTable = (0, tableName_1.getTableName)(empresaId, 'articulo');
        // Usamos AppDataSource.createQueryBuilder para evitar conflictos de metadatos de Entidad
        // con las tablas dinámicas. Esto emula el éxito que tuvimos con Artículos.
        const pedidos = await database_1.AppDataSource.createQueryBuilder()
            .select('p.*')
            .addSelect('c.cdet', 'cliente_nombre') // Alias para facilitar frontend
            .addSelect('a.cdet', 'articulo_descripcion')
            .from(pedidoTable, 'p')
            .leftJoin(clienteTable, 'c', 'p.cli = c.ccod AND c.id = :empresaId', { empresaId })
            .leftJoin(articuloTable, 'a', 'p.cod = a.ccod AND a.id = :empresaId', { empresaId })
            .where('p.id = :empresaId', { empresaId })
            .orderBy('p.dfec', 'DESC')
            .getRawMany();
        // Mapeamos para anidar objetos si el front lo espera (opcional, pero seguro)
        const result = pedidos.map(row => ({
            ...row,
            cliente: { cnom: row.cliente_nombre }, // Estructura simulada de relación
            articulo: { cdes: row.articulo_descripcion }
        }));
        res.json(result);
    }
    catch (error) {
        console.error('[Pedidos] Get Error:', error);
        res.status(500).json({
            message: 'Error al obtener los pedidos',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getPedidos = getPedidos;
/**
 * Crea un pedido validando los datos (Solo inserción)
 */
const createPedido = async (req, res) => {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    try {
        const { empresaId, vendedorId } = req.user || {};
        if (!empresaId)
            return res.status(403).json({ message: 'Empresa no identificada' });
        const { num, cod, des, can, pre, cli } = req.body;
        // Validación básica
        if (!cod || !cli || can === undefined || pre === undefined) {
            return res.status(400).json({ message: 'Faltan campos obligatorios (Articulo, Cliente, Cantidad, Precio)' });
        }
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        await queryRunner.manager.createQueryBuilder()
            .insert()
            .into(pedidoTable)
            .values({
            num: num || `PED-${Date.now()}`,
            ven: vendedorId || 'VEN001',
            cod: cod,
            des: des || '',
            can: Number(can),
            pre: Number(pre),
            cli: cli,
            id: empresaId,
            dfec: new Date(),
            itip: 1
        })
            .execute();
        await queryRunner.commitTransaction();
        // Recuperamos el ID generado buscando por el número único o timestamp
        // (insertId a veces no es fiable en todos los drivers con tablas legacy)
        res.status(201).json({ success: true, message: 'Pedido creado correctamente' });
    }
    catch (error) {
        if (queryRunner.isTransactionActive)
            await queryRunner.rollbackTransaction();
        console.error('[Pedidos] Create Error:', error);
        res.status(500).json({
            message: 'Error al crear el pedido',
            error: error instanceof Error ? error.message : String(error)
        });
    }
    finally {
        await queryRunner.release();
    }
};
exports.createPedido = createPedido;
const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const articuloTable = (0, tableName_1.getTableName)(empresaId, 'articulo');
        const pedido = await database_1.AppDataSource.createQueryBuilder()
            .select('p.*')
            .addSelect('c.cdet', 'cliente_nombre')
            .addSelect('a.cdet', 'articulo_descripcion')
            .from(pedidoTable, 'p')
            .leftJoin(clienteTable, 'c', 'p.cli = c.ccod AND c.id = :empresaId', { empresaId })
            .leftJoin(articuloTable, 'a', 'p.cod = a.ccod AND a.id = :empresaId', { empresaId })
            .where('p.xxx = :id AND p.id = :empresaId', { id, empresaId })
            .getRawOne();
        if (!pedido)
            return res.status(404).json({ message: 'Pedido no encontrado' });
        const result = {
            ...pedido,
            cliente: { cnom: pedido.cliente_nombre },
            articulo: { cdes: pedido.articulo_descripcion }
        };
        res.json(result);
    }
    catch (error) {
        console.error('[Pedidos] GetById Error:', error);
        res.status(500).json({ message: 'Error al obtener el pedido' });
    }
};
exports.getPedidoById = getPedidoById;
const getPedidosByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const { empresaId } = req.user || {};
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const pedidos = await database_1.AppDataSource.createQueryBuilder()
            .select('p.*')
            .from(pedidoTable, 'p')
            .where('p.cli = :clienteId AND p.id = :empresaId', { clienteId, empresaId })
            .orderBy('p.dfec', 'DESC')
            .getRawMany();
        res.json(pedidos);
    }
    catch (error) {
        console.error('[Pedidos] GetByClient Error:', error);
        res.status(500).json({ message: 'Error al obtener pedidos del cliente' });
    }
};
exports.getPedidosByCliente = getPedidosByCliente;
