import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { getTableName } from '../utils/tableName';

export const getArticulos = async (req: Request, res: Response) => {
    try {
        const { empresaId } = (req as any).user || {};
        if (!empresaId) return res.status(403).json({ message: 'Empresa no identificada' });

        const tableName = getTableName(empresaId, 'articulo');

        const query = AppDataSource.createQueryBuilder()
            .select('a.*')
            .from(tableName, 'a')
            .where('a.id = :empresaId', { empresaId });

        const articulos = await query.orderBy('a.cdet', 'ASC').getRawMany();
        res.json(articulos);
    } catch (error) {
        console.error('[Articulos] Error:', error);
        res.status(500).json({
            message: 'Error al obtener artículos',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getArticuloById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { empresaId } = (req as any).user || {};
        const tableName = getTableName(empresaId, 'articulo');

        const articulo = await AppDataSource.createQueryBuilder()
            .select('a.*')
            .from(tableName, 'a')
            .where('a.xxx = :id AND a.id = :empresaId', { id, empresaId })
            .getRawOne();

        if (!articulo) return res.status(404).json({ message: 'Artículo no encontrado' });
        res.json(articulo);
    } catch (error) {
        console.error('[Articulos] GetById Error:', error);
        res.status(500).json({ message: 'Error al obtener artículo' });
    }
};

// Placeholder functions if they are imported in routes
export const createArticulo = async (req: Request, res: Response) => {
    res.status(501).json({ message: 'No implementado' });
};

export const updateArticulo = async (req: Request, res: Response) => {
    res.status(501).json({ message: 'No implementado' });
};

export const deleteArticulo = async (req: Request, res: Response) => {
    res.status(501).json({ message: 'No implementado' });
};
