"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteById = exports.getClientes = void 0;
const database_1 = require("../config/database");
const Cliente_1 = require("../entities/Cliente");
const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
const getClientes = async (req, res) => {
    try {
        const clientes = await clienteRepository.find();
        res.json(clientes);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes', error });
    }
};
exports.getClientes = getClientes;
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await clienteRepository.findOneBy({ id: Number(id) });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(cliente);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente', error });
    }
};
exports.getClienteById = getClienteById;
const createCliente = async (req, res) => {
    try {
        const cliente = clienteRepository.create(req.body);
        const resultado = await clienteRepository.save(cliente);
        res.status(201).json(resultado);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear el cliente', error });
    }
};
exports.createCliente = createCliente;
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await clienteRepository.findOneBy({ id: Number(id) });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        clienteRepository.merge(cliente, req.body);
        const resultado = await clienteRepository.save(cliente);
        res.json(resultado);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cliente', error });
    }
};
exports.updateCliente = updateCliente;
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await clienteRepository.delete(id);
        if (resultado.affected === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el cliente', error });
    }
};
exports.deleteCliente = deleteCliente;
