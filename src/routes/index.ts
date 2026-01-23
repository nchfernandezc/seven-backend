import { Router } from 'express';
import articuloRoutes from './articulo.routes';
import clienteRoutes from './cliente.routes';
import cxcRoutes from './cxc.routes';
import pedidoRoutes from './pedido.routes';
import authRoutes from './auth.routes';
import statsRoutes from './stats.routes';

const router = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Verifica que la API esté funcionando
 *     tags: [API]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: 'API de Gestión de Pedidos - Funcionando'
 *               version: '1.0.0'
 */
router.get('/', (req, res) => {
  res.json({ message: 'API de Gestión de Pedidos - Funcionando', version: '1.0.0' });
});

// API Routes
router.use('/api/articulos', articuloRoutes);
router.use('/api/clientes', clienteRoutes);
router.use('/api/cuentas-por-cobrar', cxcRoutes);
router.use('/api/pedidos', pedidoRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/stats', statsRoutes);

export default router;