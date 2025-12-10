import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cliente } from '../entities/Cliente';

const clienteRepository = AppDataSource.getRepository(Cliente);

// Extensión del tipo Request para incluir datos de usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        empresaId: number;
        vendedorId?: string;
      };
    }
  }
}

/**
 * Obtiene todos los clientes de una empresa
 * Filtra por vendedor si está especificado
 */
export const getClientes = async (req: Request, res: Response) => {
  try {
    const { empresaId, vendedorId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const queryBuilder = clienteRepository
      .createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.vendedor', 'vendedor')
      .where('cliente.empresaId = :empresaId', { empresaId })
      .orderBy('cliente.nombre', 'ASC');

    // Filtrar por vendedor si está especificado
    if (vendedorId) {
      queryBuilder.andWhere('cliente.vendedorCodigo = :vendedorId', { vendedorId });
    }

    const clientes = await queryBuilder.getMany();

    res.json(clientes);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      message: 'Error al obtener los clientes',
      error: errorMessage
    });
  }
};

/**
 * Busca clientes por nombre, código o teléfono
 */
export const buscarClientes = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const { empresaId, vendedorId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
    }

    const queryBuilder = clienteRepository
      .createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.vendedor', 'vendedor')
      .where('cliente.empresaId = :empresaId', { empresaId })
      .andWhere(
        '(LOWER(cliente.nombre) LIKE LOWER(:search) OR LOWER(cliente.codigo) LIKE LOWER(:search) OR cliente.telefono LIKE :search)',
        { search: `%${q}%` }
      )
      .orderBy('cliente.nombre', 'ASC');

    if (vendedorId) {
      queryBuilder.andWhere('cliente.vendedorCodigo = :vendedorId', { vendedorId });
    }

    const clientes = await queryBuilder.getMany();
    res.json(clientes);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al buscar clientes:', error);
    res.status(500).json({
      message: 'Error al buscar clientes',
      error: errorMessage
    });
  }
};

/**
 * Obtiene un cliente por ID
 */
export const getClienteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const cliente = await clienteRepository.findOne({
      where: {
        id: Number(id),
        empresaId
      },
      relations: ['vendedor']
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ message: 'Error al obtener el cliente', error: errorMessage });
  }
};

/**
 * Crea un nuevo cliente
 */
export const createCliente = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar código único por empresa
    const existingCliente = await clienteRepository.findOne({
      where: {
        codigo: req.body.codigo,
        empresaId
      }
    });

    if (existingCliente) {
      return res.status(400).json({ message: 'El código de cliente ya existe' });
    }

    const cliente = clienteRepository.create({
      ...req.body,
      empresaId
    });

    const resultado = await clienteRepository.save(cliente);
    res.status(201).json(resultado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al crear cliente:', error);
    res.status(500).json({ message: 'Error al crear el cliente', error: errorMessage });
  }
};

/**
 * Actualiza un cliente existente
 */
export const updateCliente = async (req: Request, res: Response) => {
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
      }
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar código único si se está actualizando
    if (req.body.codigo && req.body.codigo !== cliente.codigo) {
      const existingCliente = await clienteRepository.findOne({
        where: {
          codigo: req.body.codigo,
          empresaId
        }
      });

      if (existingCliente) {
        return res.status(400).json({ message: 'El código de cliente ya existe' });
      }
    }

    clienteRepository.merge(cliente, req.body);
    const resultado = await clienteRepository.save(cliente);

    res.json(resultado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar el cliente', error: errorMessage });
  }
};

/**
 * Elimina un cliente
 */
export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const resultado = await clienteRepository.delete({
      id: Number(id),
      empresaId
    });

    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({
      message: 'Error al eliminar el cliente',
      error: errorMessage
    });
  }
};