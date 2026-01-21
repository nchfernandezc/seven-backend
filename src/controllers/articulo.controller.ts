import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Articulo } from '../entities/Articulo';
import { getTableName } from '../utils/tableName';

const articuloRepository = AppDataSource.getRepository(Articulo);

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

const mapRawToArticulo = (raw: any) => ({
  internalId: raw.xxx,
  id: raw.id,
  ccod: raw.ccod,
  cdet: raw.cdet,
  cuni: raw.cuni,
  cref: raw.cref,
  npre1: raw.npre1,
  npre2: raw.npre2,
  npre3: raw.npre3,
  ncan1: raw.ncan1,
  ides: raw.ides,
  marca: raw.cmar
});

/**
 * Obtiene todos los artículos de una empresa
 */
export const getArticulos = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'articulo');

    // Use raw query to avoid Entity Metadata validation errors
    const rawArticulos = await AppDataSource.createQueryBuilder()
      .select('*')
      .from(tableName, 'articulo')
      .where('articulo.id = :empresaId', { empresaId }) // 'id' is the empresaId column
      .orderBy('articulo.cdet', 'ASC')
      .getRawMany();

    const articulos = rawArticulos.map(mapRawToArticulo);

    res.json(articulos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener artículos:', error);
    res.status(500).json({ message: 'Error al obtener los artículos', error: errorMessage });
  }
};

/**
 * Obtiene un artículo por ID (internalId / xxx)
 */
export const getArticuloById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'articulo');

    const rawArticulo = await AppDataSource.createQueryBuilder()
      .select('*')
      .from(tableName, 'articulo')
      .where('articulo.xxx = :id', { id: Number(id) }) // 'xxx' is the internalId column
      .andWhere('articulo.id = :empresaId', { empresaId })
      .getRawOne();

    if (!rawArticulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json(mapRawToArticulo(rawArticulo));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener artículo:', error);
    res.status(500).json({ message: 'Error al obtener el artículo', error: errorMessage });
  }
};

/**
 * Crea un nuevo artículo
 */
export const createArticulo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'articulo');

    // Verificar código único por empresa
    // Verificar código único por empresa
    const existingArticulo = await articuloRepository.createQueryBuilder('articulo')
      .from(tableName, 'articulo')
      .where('articulo.ccod = :codigo', { codigo: req.body.ccod })
      .andWhere('articulo.id = :empresaId', { empresaId })
      .getOne();

    if (existingArticulo) {
      return res.status(400).json({
        message: 'El código de artículo ya existe'
      });
    }

    // Prepare object manually since we can't use repo.create for dynamic table inserts easily
    // We rely on QueryBuilder insert
    const insertResult = await articuloRepository.createQueryBuilder()
      .insert()
      .into(tableName)
      .values({
        ...req.body,
        id: empresaId
      })
      .execute();

    // Fetch the created item to return standard response
    const newId = insertResult.identifiers[0].internalId || insertResult.raw.insertId;

    const nuevoArticulo = await articuloRepository.createQueryBuilder('articulo')
      .from(tableName, 'articulo')
      .where('articulo.internalId = :id', { id: Number(newId) })
      .getOne();

    res.status(201).json(nuevoArticulo);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al crear artículo:', error);
    res.status(500).json({ message: 'Error al crear el artículo', error: errorMessage });
  }
};

/**
 * Actualiza un artículo existente
 */
export const updateArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'articulo');

    const articulo = await articuloRepository.createQueryBuilder('articulo')
      .from(tableName, 'articulo')
      .where('articulo.internalId = :id', { id: Number(id) })
      .andWhere('articulo.id = :empresaId', { empresaId })
      .getOne();

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Verificar código único si se está actualizando
    if (req.body.ccod && req.body.ccod !== articulo.ccod) {
      const existingArticulo = await articuloRepository.createQueryBuilder('articulo')
        .from(tableName, 'articulo')
        .where('articulo.ccod = :codigo', { codigo: req.body.ccod })
        .andWhere('articulo.id = :empresaId', { empresaId })
        .getOne();

      if (existingArticulo) {
        return res.status(400).json({
          message: 'El código de artículo ya existe'
        });
      }
    }

    await articuloRepository.createQueryBuilder()
      .update(tableName) // Note: typeorm update takes entity class or table name
      .set(req.body)
      .where('xxx = :id', { id: Number(id) }) // 'xxx' is the actual DB column for internalId
      .andWhere('id = :empresaId', { empresaId }) // 'id' is DB column for empresaId
      .execute();

    const articuloActualizado = await articuloRepository.createQueryBuilder('articulo')
      .from(tableName, 'articulo')
      .where('articulo.internalId = :id', { id: Number(id) })
      .getOne();

    res.json(articuloActualizado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al actualizar artículo:', error);
    res.status(500).json({ message: 'Error al actualizar el artículo', error: errorMessage });
  }
};

/**
 * Elimina un artículo
 */
export const deleteArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'articulo');

    const resultado = await articuloRepository.createQueryBuilder()
      .delete()
      .from(tableName)
      .where('xxx = :id', { id: Number(id) }) // Database column name 'xxx'
      .andWhere('id = :empresaId', { empresaId }) // Database column name 'id'
      .execute();

    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al eliminar artículo:', error);
    res.status(500).json({ message: 'Error al eliminar el artículo', error: errorMessage });
  }
};