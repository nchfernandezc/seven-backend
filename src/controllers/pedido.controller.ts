import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Pedido } from '../entities/Pedido';

const pedidoRepository = AppDataSource.getRepository(Pedido);

// Obtener todos los pedidos
export const getPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await pedidoRepository.find({
      relations: ['cliente', 'articulo']
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos', error });
  }
};

// Obtener un pedido por ID
export const getPedidoById = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pedido', error });
  }
};

// Crear un nuevo pedido
export const createPedido = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido', error });
  }
};

// Actualizar un pedido existente
export const updatePedido = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el pedido', error });
  }
};

// Eliminar un pedido
export const deletePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await pedidoRepository.delete(id);
    
    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el pedido', error });
  }
};

// Obtener pedidos por cliente
export const getPedidosByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const pedidos = await pedidoRepository.find({
      where: { clienteCodigo: clienteId },
      relations: ['cliente', 'articulo']
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos del cliente', error });
  }
};

// Obtener pedidos por artículo
export const getPedidosByArticulo = async (req: Request, res: Response) => {
  try {
    const { articuloCodigo } = req.params;
    const pedidos = await pedidoRepository.find({
      where: { articuloCodigo },
      relations: ['cliente', 'articulo']
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos del artículo', error });
  }
};
