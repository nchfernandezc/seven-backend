"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Obtiene estadísticas generales para el dashboard
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders:
 *                   type: integer
 *                 totalClients:
 *                   type: integer
 *                 totalProducts:
 *                   type: integer
 */
router.get('/', stats_controller_1.getDashboardStats);
router.get('/dashboard', stats_controller_1.getDashboardStats);
exports.default = router;
