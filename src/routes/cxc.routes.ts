import { Router } from 'express';
import { 
  getCxcs, 
  getCxcById, 
} from '../controllers/cxc.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cuentas por Cobrar
 *   description: Gestión de cuentas por cobrar
 */

/**
 * @swagger
 * /cuentas-por-cobrar:
 *   get:
 *     summary: Obtiene todas las cuentas por cobrar
 *     tags: [Cuentas por Cobrar]
 *     responses:
 *       200:
 *         description: Lista de cuentas por cobrar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cxcobrar'
 */
router.get('/', getCxcs);

/**
 * @swagger
 * /cuentas-por-cobrar/{id}:
 *   get:
 *     summary: Obtiene una cuenta por cobrar por ID
 *     tags: [Cuentas por Cobrar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta por cobrar
 *     responses:
 *       200:
 *         description: Cuenta por cobrar encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cxcobrar'
 *       404:
 *         description: Cuenta por cobrar no encontrada
 */
router.get('/:id', getCxcById);

export default router;