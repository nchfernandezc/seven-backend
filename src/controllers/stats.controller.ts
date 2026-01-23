import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { getTableName } from '../utils/tableName';

/**
 * Obtiene las estadísticas generales para el dashboard
 */
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const { empresaId } = (req as any).user || {};

        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }

        const pedidoTable = getTableName(empresaId, 'pedido');
        const clienteTable = getTableName(empresaId, 'cliente');
        const articuloTable = getTableName(empresaId, 'articulo');

        // Ejecutamos los conteos en paralelo para mejor rendimiento usando query raw
        const [ordersResult, clientsResult, productsResult] = await Promise.all([
            AppDataSource.query(`SELECT COUNT(*) as count FROM \`${pedidoTable}\` WHERE id = ?`, [empresaId]),
            AppDataSource.query(`SELECT COUNT(*) as count FROM \`${clienteTable}\` WHERE id = ?`, [empresaId]),
            AppDataSource.query(`SELECT COUNT(*) as count FROM \`${articuloTable}\` WHERE id = ?`, [empresaId])
        ]);

        res.json({
            totalOrders: parseInt(ordersResult[0]?.count || '0'),
            totalClients: parseInt(clientsResult[0]?.count || '0'),
            totalProducts: parseInt(productsResult[0]?.count || '0')
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            message: 'Error al obtener estadísticas',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
