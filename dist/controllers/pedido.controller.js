"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPedidosByArticulo = exports.getPedidosByCliente = exports.deletePedido = exports.updatePedido = exports.createPedido = exports.getPedidoById = exports.getPedidos = void 0;
const database_1 = require("../config/database");
const Pedido_1 = require("../entities/Pedido");
const pedidoRepository = database_1.AppDataSource.getRepository(Pedido_1.Pedido);
// Obtener todos los pedidos
const getPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoRepository.find({
            relations: ['cliente', 'articulo']
        });
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
};
exports.getPedidos = getPedidos;
// Obtener un pedido por ID
const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidoRepository.findOne({
            where: { id: Number(id) },
            relations: ['cliente', 'articulo']
        });
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.json(pedido);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido', error });
    }
};
exports.getPedidoById = getPedidoById;
// Crear un nuevo pedido
const createPedido = async (req, res) => {
    try {
        const pedido = pedidoRepository.create({
            ...req.body,
            fecha: new Date() // Establecer la fecha actual
        });
        const resultado = await pedidoRepository.save(pedido);
        // Si resultado es un array, tomar el primer elemento
        const savedPedido = Array.isArray(resultado) ? resultado[0] : resultado;
        // Cargar las relaciones para la respuesta
        const pedidoConRelaciones = await pedidoRepository.findOne({
            where: { id: savedPedido.id },
            relations: ['cliente', 'articulo']
        });
        res.status(201).json(pedidoConRelaciones);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido', error });
    }
};
exports.createPedido = createPedido;
// Actualizar un pedido existente
const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidoRepository.findOneBy({ id: Number(id) });
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        pedidoRepository.merge(pedido, req.body);
        const resultado = await pedidoRepository.save(pedido);
        // Cargar las relaciones para la respuesta
        const pedidoActualizado = await pedidoRepository.findOne({
            where: { id: resultado.id },
            relations: ['cliente', 'articulo']
        });
        res.json(pedidoActualizado);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pedido', error });
    }
};
exports.updatePedido = updatePedido;
// Eliminar un pedido
const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pedidoRepository.delete(id);
        if (resultado.affected === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pedido', error });
    }
};
exports.deletePedido = deletePedido;
// Obtener pedidos por cliente
const getPedidosByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const pedidos = await pedidoRepository.find({
            where: { clienteCodigo: clienteId },
            relations: ['cliente', 'articulo']
        });
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos del cliente', error });
    }
};
exports.getPedidosByCliente = getPedidosByCliente;
// Obtener pedidos por artículo
const getPedidosByArticulo = async (req, res) => {
    try {
        const { articuloCodigo } = req.params;
        const pedidos = await pedidoRepository.find({
            where: { articuloCodigo },
            relations: ['cliente', 'articulo']
        });
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos del artículo', error });
    }
};
exports.getPedidosByArticulo = getPedidosByArticulo;
