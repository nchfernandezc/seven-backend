"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = require("../config/database");
const Pedido_1 = require("../entities/Pedido");
const Cliente_1 = require("../entities/Cliente");
const Articulo_1 = require("../entities/Articulo");
const tableName_1 = require("../utils/tableName");
const pedidoRepository = database_1.AppDataSource.getRepository(Pedido_1.Pedido);
const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
const articuloRepository = database_1.AppDataSource.getRepository(Articulo_1.Articulo);
const getDashboardStats = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const articuloTable = (0, tableName_1.getTableName)(empresaId, 'articulo');
        // Execute queries in parallel using raw table names
        const [totalOrdersResult, totalClientsResult, totalProductsResult] = await Promise.all([
            // Count orders
            database_1.AppDataSource.createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(pedidoTable, 'pedido')
                .where('pedido.id = :empresaId', { empresaId })
                .getRawOne(),
            // Count clients
            database_1.AppDataSource.createQueryBuilder()
                .select('COUNT(*)', 'count')
                .from(clienteTable, 'cliente')
                .where('cliente.id = :empresaId', { empresaId })
                .getRawOne(),
            // Count products
            database_1.AppDataSource.createQueryBuilder()
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas', error: errorMessage });
    }
};
exports.getDashboardStats = getDashboardStats;
