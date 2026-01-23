"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPedidosByCliente = exports.getPedidoById = exports.createPedido = exports.getPedidos = void 0;
const database_1 = require("../config/database");
const Pedido_1 = require("../entities/Pedido");
const tableName_1 = require("../utils/tableName");
const pedidoRepository = database_1.AppDataSource.getRepository(Pedido_1.Pedido);
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
        // Usamos el QueryBuilder del repositorio para mantener el tipado y validaciones
        const pedidos = await pedidoRepository.createQueryBuilder('p')
            .from(pedidoTable, 'p') // Forzamos la tabla dinámica
            .leftJoinAndMapOne('p.cliente', clienteTable, 'c', 'p.cli = c.ccod AND c.id = :empresaId', { empresaId })
            .leftJoinAndMapOne('p.articulo', articuloTable, 'a', 'p.cod = a.ccod AND a.id = :empresaId', { empresaId })
            .where('p.id = :empresaId', { empresaId })
            .orderBy('p.dfec', 'DESC')
            .getMany();
        res.json(pedidos);
    }
    catch (error) {
        console.error('[Pedidos] Error:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos' });
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
        // Validación básica de campos requeridos
        if (!cod || !cli || can === undefined || pre === undefined) {
            return res.status(400).json({ message: 'Faltan campos obligatorios (Articulo, Cliente, Cantidad, Precio)' });
        }
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        // Insertamos usando el QueryBuilder del manager para inyección segura
        const result = await queryRunner.manager.createQueryBuilder()
            .insert()
            .into(pedidoTable)
            .values({
            num: num || `PED-${Date.now()}`,
            ven: vendedorId,
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
        res.status(201).json({
            success: true,
            id: result.identifiers[0]?.internalId || result.raw.insertId
        });
    }
    catch (error) {
        if (queryRunner.isTransactionActive)
            await queryRunner.rollbackTransaction();
        console.error('[Pedidos] Create Error:', error);
        res.status(500).json({ message: 'Error al crear el pedido' });
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
        const pedido = await pedidoRepository.createQueryBuilder('p')
            .from(pedidoTable, 'p')
            .leftJoinAndMapOne('p.cliente', clienteTable, 'c', 'p.cli = c.ccod AND c.id = :empresaId', { empresaId })
            .leftJoinAndMapOne('p.articulo', articuloTable, 'a', 'p.cod = a.ccod AND a.id = :empresaId', { empresaId })
            .where('p.xxx = :id AND p.id = :empresaId', { id, empresaId })
            .getOne();
        if (!pedido)
            return res.status(404).json({ message: 'Pedido no encontrado' });
        res.json(pedido);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido' });
    }
};
exports.getPedidoById = getPedidoById;
const getPedidosByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const { empresaId } = req.user || {};
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const pedidos = await pedidoRepository.createQueryBuilder('p')
            .from(pedidoTable, 'p')
            .where('p.cli = :clienteId AND p.id = :empresaId', { clienteId, empresaId })
            .orderBy('p.dfec', 'DESC')
            .getMany();
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos del cliente' });
    }
};
exports.getPedidosByCliente = getPedidosByCliente;
