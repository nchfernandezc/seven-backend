import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cliente } from '../entities/Cliente';
import { getTableName } from '../utils/tableName';

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

    const tableName = getTableName(empresaId, 'cliente');

    // Using alias 'cliente' linked to Cliente entity logic
    // Use raw query for strict column selection matching user request
    // "Id-ccod-cdet-cdir-ctel -cven"
    const rawClientes = await AppDataSource.createQueryBuilder()
      .select([
        'cliente.xxx as xxx',
        'cliente.id as id',
        'cliente.ccod as ccod',
        'cliente.cdet as cdet',
        'cliente.cdir as cdir',
        'cliente.ctel as ctel',
        'cliente.cven as cven'
      ])
      .from(tableName, 'cliente') // Use dynamic table name
      .where('cliente.id = :empresaId', { empresaId })
      .orderBy('cliente.cdet', 'ASC');

    // Filtrar por vendedor si está especificado
    if (vendedorId) {
      rawClientes.andWhere('cliente.cven = :vendedorId', { vendedorId });
    }

    const result = await rawClientes.getRawMany();

    // Map to simplified structure or keep raw if user expects "cloud table" format
    // User listed "Id-ccod..." so we return objects with these keys? 
    // Or standard JSON camelCase?
    // User's previous Articulo controller returns camelCase but maps from raw.
    // I will return camelCase but ensuring these fields are the focus.

    const clientes = result.map(raw => ({
      internalId: raw.xxx,
      id: raw.id,
      ccod: raw.ccod,
      cdet: raw.cdet,
      cdir: raw.cdir,
      ctel: raw.ctel,
      cven: raw.cven
    }));

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

    const tableName = getTableName(empresaId, 'cliente');

    const queryBuilder = AppDataSource.createQueryBuilder()
      .select([
        'cliente.xxx as xxx',
        'cliente.id as id',
        'cliente.ccod as ccod',
        'cliente.cdet as cdet',
        'cliente.cdir as cdir',
        'cliente.ctel as ctel',
        'cliente.cven as cven'
      ])
      .from(tableName, 'cliente')
      .where('cliente.id = :empresaId', { empresaId })
      .andWhere(
        '(LOWER(cliente.cdet) LIKE LOWER(:search) OR LOWER(cliente.ccod) LIKE LOWER(:search) OR cliente.ctel LIKE :search)',
        { search: `%${q}%` }
      )
      .orderBy('cliente.cdet', 'ASC');

    if (vendedorId) {
      queryBuilder.andWhere('cliente.cven = :vendedorId', { vendedorId });
    }

    const result = await queryBuilder.getRawMany();

    const clientes = result.map(raw => ({
      internalId: raw.xxx,
      id: raw.id,
      ccod: raw.ccod,
      cdet: raw.cdet,
      cdir: raw.cdir,
      ctel: raw.ctel,
      cven: raw.cven
    }));

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

    const tableName = getTableName(empresaId, 'cliente');

    const rawCliente = await AppDataSource.createQueryBuilder()
      .select([
        'cliente.xxx as xxx',
        'cliente.id as id',
        'cliente.ccod as ccod',
        'cliente.cdet as cdet',
        'cliente.cdir as cdir',
        'cliente.ctel as ctel',
        'cliente.cven as cven'
      ])
      .from(tableName, 'cliente')
      .where('cliente.xxx = :id', { id: Number(id) })
      .andWhere('cliente.id = :empresaId', { empresaId })
      .getRawOne();

    if (!rawCliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const cliente = {
      internalId: rawCliente.xxx,
      id: rawCliente.id,
      ccod: rawCliente.ccod,
      cdet: rawCliente.cdet,
      cdir: rawCliente.cdir,
      ctel: rawCliente.ctel,
      cven: rawCliente.cven
    };

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

    const tableName = getTableName(empresaId, 'cliente');

    // Verificar código único por empresa
    const existingCliente = await AppDataSource.createQueryBuilder()
      .select('cliente.xxx')
      .from(tableName, 'cliente')
      .where('cliente.ccod = :codigo', { codigo: req.body.ccod })
      .andWhere('cliente.id = :empresaId', { empresaId })
      .getRawOne();

    if (existingCliente) {
      return res.status(400).json({ message: 'El código de cliente ya existe' });
    }

    const insertResult = await AppDataSource.createQueryBuilder()
      .insert()
      .into(tableName)
      .values({
        ...req.body,
        id: empresaId
      })
      .execute();

    const newId = insertResult.identifiers[0].internalId || insertResult.raw.insertId;

    const rawNuevoCliente = await AppDataSource.createQueryBuilder()
      .select([
        'cliente.xxx as xxx',
        'cliente.id as id',
        'cliente.ccod as ccod',
        'cliente.cdet as cdet',
        'cliente.cdir as cdir',
        'cliente.ctel as ctel',
        'cliente.cven as cven'
      ])
      .from(tableName, 'cliente')
      .where('cliente.xxx = :id', { id: Number(newId) })
      .getRawOne();

    res.status(201).json({
      internalId: rawNuevoCliente.xxx,
      id: rawNuevoCliente.id,
      ccod: rawNuevoCliente.ccod,
      cdet: rawNuevoCliente.cdet,
      cdir: rawNuevoCliente.cdir,
      ctel: rawNuevoCliente.ctel,
      cven: rawNuevoCliente.cven
    });
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

    const tableName = getTableName(empresaId, 'cliente');

    const rawCliente = await AppDataSource.createQueryBuilder()
      .select('cliente.ccod')
      .from(tableName, 'cliente')
      .where('cliente.xxx = :id', { id: Number(id) })
      .andWhere('cliente.id = :empresaId', { empresaId })
      .getRawOne();

    if (!rawCliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar código único si se está actualizando
    if (req.body.ccod && req.body.ccod !== rawCliente.ccod) {
      const existingCliente = await AppDataSource.createQueryBuilder()
        .select('cliente.xxx')
        .from(tableName, 'cliente')
        .where('cliente.ccod = :codigo', { codigo: req.body.ccod })
        .andWhere('cliente.id = :empresaId', { empresaId })
        .getRawOne();

      if (existingCliente) {
        return res.status(400).json({ message: 'El código de cliente ya existe' });
      }
    }

    await AppDataSource.createQueryBuilder()
      .update(tableName)
      .set(req.body)
      .where('xxx = :id', { id: Number(id) })
      .andWhere('id = :empresaId', { empresaId })
      .execute();

    const rawClienteActualizado = await AppDataSource.createQueryBuilder()
      .select([
        'cliente.xxx as xxx',
        'cliente.id as id',
        'cliente.ccod as ccod',
        'cliente.cdet as cdet',
        'cliente.cdir as cdir',
        'cliente.ctel as ctel',
        'cliente.cven as cven'
      ])
      .from(tableName, 'cliente')
      .where('cliente.xxx = :id', { id: Number(id) })
      .getRawOne();

    res.json({
      internalId: rawClienteActualizado.xxx,
      id: rawClienteActualizado.id,
      ccod: rawClienteActualizado.ccod,
      cdet: rawClienteActualizado.cdet,
      cdir: rawClienteActualizado.cdir,
      ctel: rawClienteActualizado.ctel,
      cven: rawClienteActualizado.cven
    });
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

    const tableName = getTableName(empresaId, 'cliente');

    const resultado = await AppDataSource.createQueryBuilder()
      .delete()
      .from(tableName)
      .where('xxx = :id', { id: Number(id) })
      .andWhere('id = :empresaId', { empresaId })
      .execute();

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