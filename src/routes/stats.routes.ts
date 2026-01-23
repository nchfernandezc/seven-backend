import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';

const router = Router();

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
router.get('/', getDashboardStats);
router.get('/dashboard', getDashboardStats);

export default router;
