"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteById = exports.getClientes = void 0;
const database_1 = require("../config/database");
const Cliente_1 = require("../entities/Cliente");
const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
const getClientes = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const clientes = await clienteRepository.find({
            where: { empresaId },
            order: { nombre: 'ASC' },
            relations: ['vendedor']
        });
        res.json(clientes);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener los clientes';
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ message: 'Error al obtener los clientes', error: errorMessage });
    }
};
exports.getClientes = getClientes;
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const cliente = await clienteRepository.findOne({
            where: {
                id: Number(id),
                empresaId
            },
            relations: ['vendedor']
        });
        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente no encontrado o no pertenece a su empresa'
            });
        }
        res.json(cliente);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener el cliente';
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ message: 'Error al obtener el cliente', error: errorMessage });
    }
};
exports.getClienteById = getClienteById;
const createCliente = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        // Verificar si ya existe un cliente con el mismo código en la misma empresa
        const existingCliente = await clienteRepository.findOne({
            where: {
                codigo: req.body.codigo,
                empresaId
            }
        });
        if (existingCliente) {
            return res.status(400).json({
                message: 'Ya existe un cliente con el mismo código en esta empresa'
            });
        }
        const cliente = clienteRepository.create({
            ...req.body,
            empresaId // Asegurarse de que el cliente se asocie a la empresa del usuario
        });
        const resultado = await clienteRepository.save(cliente);
        res.status(201).json(resultado);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear el cliente';
        console.error('Error al crear cliente:', error);
        res.status(500).json({ message: 'Error al crear el cliente', error: errorMessage });
    }
};
exports.createCliente = createCliente;
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        // Buscar el cliente asegurando que pertenezca a la empresa
        const cliente = await clienteRepository.findOne({
            where: {
                id: Number(id),
                empresaId
            }
        });
        if (!cliente) {
            return res.status(404).json({
                message: 'Cliente no encontrado o no tiene permisos para modificarlo'
            });
        }
        // Si se está actualizando el código, verificar que no exista otro con el mismo código
        if (req.body.codigo && req.body.codigo !== cliente.codigo) {
            const existingCliente = await clienteRepository.findOne({
                where: {
                    codigo: req.body.codigo,
                    empresaId
                }
            });
            if (existingCliente) {
                return res.status(400).json({
                    message: 'Ya existe otro cliente con el mismo código en esta empresa'
                });
            }
        }
        // Actualizar el cliente
        clienteRepository.merge(cliente, req.body);
        const resultado = await clienteRepository.save(cliente);
        res.json(resultado);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar el cliente';
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar el cliente', error: errorMessage });
    }
};
exports.updateCliente = updateCliente;
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        // Verificar que el cliente pertenezca a la empresa antes de eliminarlo
        const resultado = await clienteRepository.delete({
            id: Number(id),
            empresaId
        });
        if (resultado.affected === 0) {
            return res.status(404).json({
                message: 'Cliente no encontrado o no tiene permisos para eliminarlo'
            });
        }
        res.status(204).send();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el cliente';
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({
            message: 'Error al eliminar el cliente',
            error: errorMessage
        });
    }
};
exports.deleteCliente = deleteCliente;
