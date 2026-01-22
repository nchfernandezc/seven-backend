import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Pedido } from '../entities/Pedido';
import { Cliente } from '../entities/Cliente';
import { Articulo } from '../entities/Articulo';
import { getTableName } from '../utils/tableName';

const pedidoRepository = AppDataSource.getRepository(Pedido);
const clienteRepository = AppDataSource.getRepository(Cliente);
const articuloRepository = AppDataSource.getRepository(Articulo);

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const { empresaId } = req.user || {};

        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }

        const pedidoTable = getTableName(empresaId, 'pedido');
        const clienteTable = getTableName(empresaId, 'cliente');
        const articuloTable = getTableName(empresaId, 'articulo');

        // Execute queries in parallel using raw table names
        const [totalOrdersResult, totalClientsResult, totalProductsResult] = await Promise.all([
            // Count orders
            AppDataSource.createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(pedidoTable, 'pedido')
                .where('pedido.id = :empresaId', { empresaId })
                .getRawOne(),

            // Count clients
            AppDataSource.createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(clienteTable, 'cliente')
                .where('cliente.id = :empresaId', { empresaId })
                .getRawOne(),

            // Count products
            AppDataSource.createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(articuloTable, 'articulo')
                .where('articulo.id = :empresaId', { empresaId })
                .getRawOne()
        ]);

        const totalOrders = parseInt(totalOrdersResult?.count || '0');
        const totalClients = parseInt(totalClientsResult?.count || '0');
        const totalProducts = parseInt(totalProductsResult?.count || '0');

        res.json({
            totalOrders,
            totalClients,
            totalProducts
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas', error: errorMessage });
    }
};
