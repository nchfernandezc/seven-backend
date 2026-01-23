"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = require("../config/database");
const tableName_1 = require("../utils/tableName");
/**
 * Obtiene las estadísticas generales para el dashboard
 */
const getDashboardStats = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const pedidoTable = (0, tableName_1.getTableName)(empresaId, 'pedido');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const articuloTable = (0, tableName_1.getTableName)(empresaId, 'articulo');
        // Ejecutamos los conteos en paralelo para mejor rendimiento usando query raw
        const [ordersResult, clientsResult, productsResult] = await Promise.all([
            database_1.AppDataSource.query(`SELECT COUNT(*) as count FROM \`${pedidoTable}\` WHERE id = ?`, [empresaId]),
            database_1.AppDataSource.query(`SELECT COUNT(*) as count FROM \`${clienteTable}\` WHERE id = ?`, [empresaId]),
            database_1.AppDataSource.query(`SELECT COUNT(*) as count FROM \`${articuloTable}\` WHERE id = ?`, [empresaId])
        ]);
        res.json({
            totalOrders: parseInt(ordersResult[0]?.count || '0'),
            totalClients: parseInt(clientsResult[0]?.count || '0'),
            totalProducts: parseInt(productsResult[0]?.count || '0')
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            message: 'Error al obtener estadísticas',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getDashboardStats = getDashboardStats;
