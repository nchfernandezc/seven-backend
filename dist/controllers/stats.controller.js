"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = require("../config/database");
const Pedido_1 = require("../entities/Pedido");
const Cliente_1 = require("../entities/Cliente");
const Articulo_1 = require("../entities/Articulo");
const pedidoRepository = database_1.AppDataSource.getRepository(Pedido_1.Pedido);
const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
const articuloRepository = database_1.AppDataSource.getRepository(Articulo_1.Articulo);
const getDashboardStats = async (req, res) => {
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
                .where('cliente.id = :empresaId', { empresaId })
                .getCount(),
            // Count clients for this company
            clienteRepository.count({
                where: { id: empresaId }
            }),
            // Count products for this company
            articuloRepository.count({
                where: { id: empresaId }
            })
        ]);
        res.json({
            totalOrders,
            totalClients,
            totalProducts
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas', error: errorMessage });
    }
};
exports.getDashboardStats = getDashboardStats;
