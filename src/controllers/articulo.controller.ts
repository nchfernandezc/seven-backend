import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { getTableName } from '../utils/tableName';

/**
 * Obtiene todos los artículos de una empresa
 */
export const getArticulos = async (req: Request, res: Response) => {
  try {
    const { empresaId } = (req as any).user || {};
    if (!empresaId) return res.status(403).json({ message: 'No se ha especificado la empresa' });

    const tableName = getTableName(empresaId, 'articulo');

    // Usamos QueryBuilder genérico para evitar conflictos con la metadata de la Entity
    // pero indicamos que queremos el resultado como tipo 'Articulo'
    const articulos = await AppDataSource.createQueryBuilder()
      .select('a.*')
      .from(tableName, 'a')
      .where('a.id = :empresaId', { empresaId })
      .orderBy('a.cdet', 'ASC')
      .getRawMany();

    res.json(articulos);
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    res.status(500).json({
      message: 'Error al obtener los artículos',
      error: error instanceof Error ? error.message : 'Error'
    });
  }
};

/**
 * Obtiene un artículo por ID
 */
export const getArticuloById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = (req as any).user || {};
    if (!empresaId) return res.status(403).json({ message: 'No se ha especificado la empresa' });

    const tableName = getTableName(empresaId, 'articulo');

    const articulo = await AppDataSource.createQueryBuilder()
      .select('a.*')
      .from(tableName, 'a')
      .where('a.xxx = :id', { id: Number(id) })
      .andWhere('a.id = :empresaId', { empresaId })
      .getRawOne();

    if (!articulo) return res.status(404).json({ message: 'Artículo no encontrado' });

    res.json(articulo);
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    res.status(500).json({
      message: 'Error al obtener el artículo',
      error: error instanceof Error ? error.message : 'Error'
    });
  }
};