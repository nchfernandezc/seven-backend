"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteById = exports.buscarClientes = exports.getClientes = void 0;
const database_1 = require("../config/database");
const Cliente_1 = require("../entities/Cliente");
const tableName_1 = require("../utils/tableName");
const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
/**
 * Obtiene todos los clientes de una empresa
 * Filtra por vendedor si está especificado
 */
const getClientes = async (req, res) => {
    try {
        const { empresaId, vendedorId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        // Using alias 'cliente' linked to Cliente entity logic
        const queryBuilder = clienteRepository.createQueryBuilder('cliente')
            .from(tableName, 'cliente')
            .leftJoinAndSelect('cliente.vendedor', 'vendedor')
            .where('cliente.empresaId = :empresaId', { empresaId })
            .orderBy('cliente.nombre', 'ASC');
        // Filtrar por vendedor si está especificado
        if (vendedorId) {
            queryBuilder.andWhere('cliente.vendedorCodigo = :vendedorId', { vendedorId });
        }
        const clientes = await queryBuilder.getMany();
        res.json(clientes);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener clientes:', error);
        res.status(500).json({
            message: 'Error al obtener los clientes',
            error: errorMessage
        });
    }
};
exports.getClientes = getClientes;
/**
 * Busca clientes por nombre, código o teléfono
 */
const buscarClientes = async (req, res) => {
    try {
        const { q } = req.query;
        const { empresaId, vendedorId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const queryBuilder = clienteRepository.createQueryBuilder('cliente')
            .from(tableName, 'cliente')
            .leftJoinAndSelect('cliente.vendedor', 'vendedor')
            .where('cliente.empresaId = :empresaId', { empresaId })
            .andWhere('(LOWER(cliente.nombre) LIKE LOWER(:search) OR LOWER(cliente.codigo) LIKE LOWER(:search) OR cliente.telefono LIKE :search)', { search: `%${q}%` })
            .orderBy('cliente.nombre', 'ASC');
        if (vendedorId) {
            queryBuilder.andWhere('cliente.vendedorCodigo = :vendedorId', { vendedorId });
        }
        const clientes = await queryBuilder.getMany();
        res.json(clientes);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al buscar clientes:', error);
        res.status(500).json({
            message: 'Error al buscar clientes',
            error: errorMessage
        });
    }
};
exports.buscarClientes = buscarClientes;
/**
 * Obtiene un cliente por ID
 */
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: 'ID de cliente inválido' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const cliente = await clienteRepository.createQueryBuilder('cliente')
            .from(tableName, 'cliente')
            .leftJoinAndSelect('cliente.vendedor', 'vendedor')
            .where('cliente.internalId = :id', { id: Number(id) })
            .andWhere('cliente.empresaId = :empresaId', { empresaId })
            .getOne();
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(cliente);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ message: 'Error al obtener el cliente', error: errorMessage });
    }
};
exports.getClienteById = getClienteById;
/**
 * Crea un nuevo cliente
 */
const createCliente = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        // Verificar código único por empresa
        const existingCliente = await clienteRepository.createQueryBuilder('cliente')
            .from(tableName, 'cliente')
            .where('cliente.codigo = :codigo', { codigo: req.body.codigo })
            .andWhere('cliente.empresaId = :empresaId', { empresaId })
            .getOne();
        if (existingCliente) {
            return res.status(400).json({ message: 'El código de cliente ya existe' });
        }
        const insertResult = await clienteRepository.createQueryBuilder()
            .insert()
            .into(tableName)
            .values({
            ...req.body,
            empresaId: empresaId
        })
            .execute();
        const newId = insertResult.identifiers[0].internalId || insertResult.raw.insertId;
        const nuevoCliente = await clienteRepository.createQueryBuilder('cliente')
            .from(tableName, 'cliente')
            .where('cliente.internalId = :id', { id: Number(newId) })
            .getOne();
        res.status(201).json(nuevoCliente);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error al crear el cliente', error: errorMessage });
    }
};
exports.createCliente = createCliente;
/**
 * Actualiza un cliente existente
 */
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const cliente = await clienteRepository.createQueryBuilder('cliente')
            .from(tableName, 'cliente')
            .where('cliente.internalId = :id', { id: Number(id) })
            .andWhere('cliente.empresaId = :empresaId', { empresaId })
            .getOne();
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Verificar código único si se está actualizando
        if (req.body.codigo && req.body.codigo !== cliente.codigo) {
            const existingCliente = await clienteRepository.createQueryBuilder('cliente')
                .from(tableName, 'cliente')
                .where('cliente.codigo = :codigo', { codigo: req.body.codigo })
                .andWhere('cliente.empresaId = :empresaId', { empresaId })
                .getOne();
            if (existingCliente) {
                return res.status(400).json({ message: 'El código de cliente ya existe' });
            }
        }
        await clienteRepository.createQueryBuilder()
            .update(tableName)
            .set(req.body)
            .where('xxx = :id', { id: Number(id) })
            .andWhere('id = :empresaId', { empresaId })
            .execute();
        const clienteActualizado = await clienteRepository.createQueryBuilder('cliente')
            .from(tableName, 'cliente')
            .where('cliente.internalId = :id', { id: Number(id) })
            .getOne();
        res.json(clienteActualizado);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar el cliente', error: errorMessage });
    }
};
exports.updateCliente = updateCliente;
/**
 * Elimina un cliente
 */
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const resultado = await clienteRepository.createQueryBuilder()
            .delete()
            .from(tableName)
            .where('xxx = :id', { id: Number(id) })
            .andWhere('id = :empresaId', { empresaId })
            .execute();
        if (resultado.affected === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({
            message: 'Error al eliminar el cliente',
            error: errorMessage
        });
    }
};
exports.deleteCliente = deleteCliente;
