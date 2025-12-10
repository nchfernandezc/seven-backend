// src/routes/auth.routes.ts
import { Router } from 'express';
import { validarVendedor } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y validación
 */

/**
 * @swagger
 * /auth/validar-vendedor/{empresaId}/{numeroVendedor}:
 *   get:
 *     summary: Valida las credenciales de un vendedor
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: empresaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *       - in: path
 *         name: numeroVendedor
 *         required: true
 *         schema:
 *           type: string
 *         description: Número/Código del vendedor
 *     responses:
 *       200:
 *         description: Vendedor válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 vendedor:
 *                   $ref: '#/components/schemas/Vendedor'
 *       404:
 *         description: Vendedor no encontrado
 */
router.get('/validar-vendedor/:empresaId/:numeroVendedor', validarVendedor);

export default router;