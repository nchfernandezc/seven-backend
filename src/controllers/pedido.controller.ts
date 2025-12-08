import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Pedido } from '../entities/Pedido';
import { Cliente } from '../entities/Cliente';
import { Articulo } from '../entities/Articulo';

const pedidoRepository = AppDataSource.getRepository(Pedido);
const clienteRepository = AppDataSource.getRepository(Cliente);
const articuloRepository = AppDataSource.getRepository(Articulo);

// Obtener todos los pedidos de la empresa del usuario
export const getPedidos = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Obtener los pedidos filtrando por empresa a través de la relación con Cliente
    const pedidos = await pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.articulo', 'articulo')
      .where('cliente.empresaId = :empresaId', { empresaId })
      .orderBy('pedido.fecha', 'DESC')
      .getMany();

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener los pedidos';
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos', error: errorMessage });
  }
};

// Obtener un pedido por ID
// Obtener un pedido por ID
export const getPedidoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Buscar el pedido verificando que pertenezca a la empresa a través de la relación con Cliente
    const pedido = await pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.articulo', 'articulo')
      .where('pedido.id = :id', { id: Number(id) })
      .andWhere('cliente.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!pedido) {
      return res.status(404).json({
        message: 'Pedido no encontrado o no tiene permisos para verlo'
      });
    }

    res.json(pedido);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener el pedido';
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ message: 'Error al obtener el pedido', error: errorMessage });
  }
};

// Crear un nuevo pedido
// Crear un nuevo pedido
export const createPedido = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar que el cliente pertenezca a la empresa
    const cliente = await clienteRepository.findOne({
      where: {
        codigo: req.body.clienteCodigo,
        empresaId
      }
    });

    if (!cliente) {
      return res.status(404).json({
        message: 'Cliente no encontrado o no pertenece a su empresa'
      });
    }

    // Verificar que el artículo pertenezca a la empresa
    const articulo = await articuloRepository.findOne({
      where: {
        codigo: req.body.articuloCodigo,
        empresaId
      }
    });

    if (!articulo) {
      return res.status(404).json({
        message: 'Artículo no encontrado o no pertenece a su empresa'
      });
    }

    const pedido = pedidoRepository.create({
      ...req.body,
      empresaId,  // ← AGREGAR ESTA LÍNEA
      fecha: new Date() // Establecer la fecha actual
    });

    const resultado = await pedidoRepository.save(pedido);

    // Cargar las relaciones para la respuesta
    const pedidoConRelaciones = await pedidoRepository.findOne({
      where: { id: resultado.id },
      relations: ['cliente', 'articulo']
    });

    res.status(201).json(pedidoConRelaciones);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear el pedido';
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido', error: errorMessage });
  }
};

// Actualizar un pedido existente
export const updatePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar que el pedido pertenezca a la empresa a través del cliente
    const pedidoExistente = await pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoin('pedido.cliente', 'cliente')
      .where('pedido.id = :id', { id: Number(id) })
      .andWhere('cliente.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!pedidoExistente) {
      return res.status(404).json({
        message: 'Pedido no encontrado o no tiene permisos para modificarlo'
      });
    }

    // Si se está actualizando el cliente, verificar que pertenezca a la empresa
    if (req.body.clienteCodigo) {
      const cliente = await clienteRepository.findOne({
        where: {
          codigo: req.body.clienteCodigo,
          empresaId
        }
      });

      if (!cliente) {
        return res.status(404).json({
          message: 'El cliente especificado no pertenece a su empresa'
        });
      }
    }

    // Si se está actualizando el artículo, verificar que pertenezca a la empresa
    if (req.body.articuloCodigo) {
      const articulo = await articuloRepository.findOne({
        where: {
          codigo: req.body.articuloCodigo,
          empresaId
        }
      });

      if (!articulo) {
        return res.status(404).json({
          message: 'El artículo especificado no pertenece a su empresa'
        });
      }
    }

    // Actualizar el pedido
    pedidoRepository.merge(pedidoExistente, req.body);
    const resultado = await pedidoRepository.save(pedidoExistente);

    // Cargar las relaciones para la respuesta
    const pedidoActualizado = await pedidoRepository.findOne({
      where: { id: resultado.id },
      relations: ['cliente', 'articulo']
    });

    res.json(pedidoActualizado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar el pedido';
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el pedido', error: errorMessage });
  }
};

// Eliminar un pedido
export const deletePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar que el pedido pertenezca a la empresa a través del cliente
    const pedido = await pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoin('pedido.cliente', 'cliente')
      .where('pedido.id = :id', { id: Number(id) })
      .andWhere('cliente.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!pedido) {
      return res.status(404).json({
        message: 'Pedido no encontrado o no tiene permisos para eliminarlo'
      });
    }

    // Eliminar el pedido
    const resultado = await pedidoRepository.delete(id);

    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'No se pudo eliminar el pedido' });
    }

    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el pedido';
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el pedido', error: errorMessage });
  }
};

// Obtener pedidos por cliente
export const getPedidosByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar que el cliente pertenezca a la empresa
    const cliente = await clienteRepository.findOne({
      where: {
        codigo: clienteId,
        empresaId
      }
    });

    if (!cliente) {
      return res.status(404).json({
        message: 'Cliente no encontrado o no pertenece a su empresa'
      });
    }

    const pedidos = await pedidoRepository.find({
      where: { clienteCodigo: clienteId },
      relations: ['cliente', 'articulo'],
      order: { fecha: 'DESC' }
    });

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener los pedidos del cliente';
    console.error('Error al obtener pedidos por cliente:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del cliente', error: errorMessage });
  }
};

// Obtener pedidos por artículo
export const getPedidosByArticulo = async (req: Request, res: Response) => {
  try {
    const { articuloCodigo } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar que el artículo pertenezca a la empresa
    const articulo = await articuloRepository.findOne({
      where: {
        codigo: articuloCodigo,
        empresaId
      }
    });

    if (!articulo) {
      return res.status(404).json({
        message: 'Artículo no encontrado o no pertenece a su empresa'
      });
    }

    const pedidos = await pedidoRepository.find({
      where: { articuloCodigo },
      relations: ['cliente', 'articulo'],
      order: { fecha: 'DESC' }
    });

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener los pedidos del artículo';
    console.error('Error al obtener pedidos por artículo:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del artículo', error: errorMessage });
  }
};
