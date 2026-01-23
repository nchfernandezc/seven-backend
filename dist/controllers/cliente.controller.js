"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClienteById = exports.buscarClientes = exports.getClientes = void 0;
const database_1 = require("../config/database");
const Cliente_1 = require("../entities/Cliente");
const tableName_1 = require("../utils/tableName");
const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
const getClientes = async (req, res) => {
    try {
        const { empresaId, vendedorId } = req.user || {};
        if (!empresaId)
            return res.status(403).json({ message: 'Empresa no identificada' });
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const query = clienteRepository.createQueryBuilder('c')
            .from(tableName, 'c')
            .where('c.id = :empresaId', { empresaId });
        if (vendedorId)
            query.andWhere('c.cven = :vendedorId', { vendedorId });
        const clientes = await query.orderBy('c.cdet', 'ASC').getMany();
        res.json(clientes);
    }
    catch (error) {
        console.error('[Clientes] Error:', error);
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};
exports.getClientes = getClientes;
const buscarClientes = async (req, res) => {
    try {
        const { q } = req.query;
        const { empresaId, vendedorId } = req.user || {};
        if (!empresaId)
            return res.status(403).json({ message: 'Empresa no identificada' });
        if (!q)
            return res.status(400).json({ message: 'Búsqueda vacía' });
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const query = clienteRepository.createQueryBuilder('c')
            .from(tableName, 'c')
            .where('c.id = :empresaId', { empresaId })
            .andWhere('(LOWER(c.cdet) LIKE LOWER(:q) OR LOWER(c.ccod) LIKE LOWER(:q))', { q: `%${q}%` });
        if (vendedorId)
            query.andWhere('c.cven = :vendedorId', { vendedorId });
        const clientes = await query.orderBy('c.cdet', 'ASC').getMany();
        res.json(clientes);
    }
    catch (error) {
        res.status(500).json({ message: 'Error en búsqueda' });
    }
};
exports.buscarClientes = buscarClientes;
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const cliente = await clienteRepository.createQueryBuilder('c')
            .from(tableName, 'c')
            .where('c.xxx = :id AND c.id = :empresaId', { id, empresaId })
            .getOne();
        if (!cliente)
            return res.status(404).json({ message: 'Cliente no encontrado' });
        res.json(cliente);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
};
exports.getClienteById = getClienteById;
