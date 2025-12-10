import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Pedido } from '../entities/Pedido';
import { Cliente } from '../entities/Cliente';
import { Articulo } from '../entities/Articulo';
import { Cxcobrar } from '../entities/Cxcobrar';

const pedidoRepository = AppDataSource.getRepository(Pedido);
const clienteRepository = AppDataSource.getRepository(Cliente);
const articuloRepository = AppDataSource.getRepository(Articulo);

/**
 * Obtiene todos los pedidos de una empresa
 */
export const getPedidos = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const pedidos = await pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.articulo', 'articulo')
      .where('cliente.empresaId = :empresaId', { empresaId })
      .orderBy('pedido.fecha', 'DESC')
      .getMany();

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos', error: errorMessage });
  }
};

/**
 * Obtiene un pedido por ID
 */
export const getPedidoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const pedido = await pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.articulo', 'articulo')
      .where('pedido.id = :id', { id: Number(id) })
      .andWhere('cliente.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(pedido);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ message: 'Error al obtener el pedido', error: errorMessage });
  }
};

/**
 * Crea un nuevo pedido y genera la cuenta por cobrar asociada
 */
export const createPedido = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);

  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Verificar cliente
    const cliente = await clienteRepository.findOne({
      where: {
        codigo: req.body.clienteCodigo,
        empresaId
      }
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar artículo
    const articulo = await articuloRepository.findOne({
      where: {
        codigo: req.body.articuloCodigo,
        empresaId
      }
    });

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Calcular total
    const total = req.body.cantidad * req.body.precioVenta;

    // Crear pedido
    const pedido = pedidoRepository.create({
      ...req.body,
      fecha: new Date(),
      estado: 1, // Pendiente
      empresaId,
      usuario: req.user?.vendedorId || 'sistema'
    }) as unknown as Pedido;

    const pedidoGuardado = await queryRunner.manager.save(pedido);

    if (!pedidoGuardado) {
      throw new Error('No se pudo guardar el pedido');
    }

    // Crear cuenta por cobrar
    const lastCxc = await cxcRepository.findOne({
      where: { empresaId },
      order: { numero: 'DESC' }
    });

    const nextNumero = lastCxc ? lastCxc.numero + 1 : 1;

    const cxc = cxcRepository.create({
      tipoDocumento: 'PED',
      numero: nextNumero,
      monto: total,
      saldo: total,
      clienteCodigo: pedidoGuardado.clienteCodigo,
      fecha: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      estado: 'pendiente' as const,
      observaciones: `Cuenta generada por pedido #${pedidoGuardado.numero}`,
      empresaId
    });

    await queryRunner.manager.save(cxc);
    await queryRunner.commitTransaction();

    // Obtener pedido con relaciones
    const pedidoCreado = await pedidoRepository.findOne({
      where: { id: pedido.id },
      relations: ['cliente', 'articulo']
    });

    res.status(201).json(pedidoCreado);
  } catch (error: unknown) {
    await queryRunner.rollbackTransaction();
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido', error: errorMessage });
  } finally {
    await queryRunner.release();
  }
};

/**
 * Actualiza un pedido existente
 */
export const updatePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const pedidoExistente = await pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoin('pedido.cliente', 'cliente')
      .where('pedido.id = :id', { id: Number(id) })
      .andWhere('cliente.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!pedidoExistente) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Verificar cliente si se actualiza
    if (req.body.clienteCodigo) {
      const cliente = await clienteRepository.findOne({
        where: {
          codigo: req.body.clienteCodigo,
          empresaId
        }
      });

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
    }

    // Verificar artículo si se actualiza
    if (req.body.articuloCodigo) {
      const articulo = await articuloRepository.findOne({
        where: {
          codigo: req.body.articuloCodigo,
          empresaId
        }
      });

      if (!articulo) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }
    }

    pedidoRepository.merge(pedidoExistente, req.body);
    const resultado = await pedidoRepository.save(pedidoExistente);

    const pedidoActualizado = await pedidoRepository.findOne({
      where: { id: resultado.id },
      relations: ['cliente', 'articulo']
    });

    res.json(pedidoActualizado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el pedido', error: errorMessage });
  }
};

/**
 * Elimina un pedido
 */
export const deletePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const pedido = await pedidoRepository
      .createQueryBuilder('pedido')
      .leftJoin('pedido.cliente', 'cliente')
      .where('pedido.id = :id', { id: Number(id) })
      .andWhere('cliente.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const resultado = await pedidoRepository.delete(id);

    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'No se pudo eliminar el pedido' });
    }

    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el pedido', error: errorMessage });
  }
};

/**
 * Obtiene pedidos de un cliente específico
 */
export const getPedidosByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const cliente = await clienteRepository.findOne({
      where: {
        codigo: clienteId,
        empresaId
      }
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const pedidos = await pedidoRepository.find({
      where: { clienteCodigo: clienteId },
      relations: ['cliente', 'articulo'],
      order: { fecha: 'DESC' }
    });

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedidos por cliente:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del cliente', error: errorMessage });
  }
};

/**
 * Obtiene pedidos de un artículo específico
 */
export const getPedidosByArticulo = async (req: Request, res: Response) => {
  try {
    const { articuloCodigo } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const articulo = await articuloRepository.findOne({
      where: {
        codigo: articuloCodigo,
        empresaId
      }
    });

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    const pedidos = await pedidoRepository.find({
      where: { articuloCodigo },
      relations: ['cliente', 'articulo'],
      order: { fecha: 'DESC' }
    });

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedidos por artículo:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del artículo', error: errorMessage });
  }
};
