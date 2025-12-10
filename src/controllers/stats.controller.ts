import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Pedido } from '../entities/Pedido';
import { Cliente } from '../entities/Cliente';
import { Articulo } from '../entities/Articulo';

const pedidoRepository = AppDataSource.getRepository(Pedido);
const clienteRepository = AppDataSource.getRepository(Cliente);
const articuloRepository = AppDataSource.getRepository(Articulo);

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const { empresaId } = req.user || {};

        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }

        // Execute queries in parallel
        const [totalOrders, totalClients, totalProducts] = await Promise.all([
            // Count orders for this company
            pedidoRepository
                .createQueryBuilder('pedido')
                .leftJoin('pedido.cliente', 'cliente')
                .where('cliente.empresaId = :empresaId', { empresaId })
                .getCount(),

            // Count clients for this company
            clienteRepository.count({
                where: { empresaId }
            }),

            // Count products for this company
            articuloRepository.count({
                where: { empresaId }
            })
        ]);

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
