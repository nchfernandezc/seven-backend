// src/routes/vendedor.routes.ts
import { Router } from 'express';
import {
    getVendedores,
    getVendedorById,
    createVendedor,
    updateVendedor,
    deleteVendedor,
    getVendedorByNumero,
    validateVendedor
} from '../controllers/vendedor.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vendedores
 *   description: Gestión de vendedores
 */

/**
 * @swagger
 * /vendedores/validate:
 *   post:
 *     summary: Valida un vendedor
 *     tags: [Vendedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empresaId
 *               - codigo
 *             properties:
 *               empresaId:
 *                 type: integer
 *               codigo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vendedor válido
 *       404:
 *         description: Vendedor no válido o no encontrado
 */
router.post('/validate', validateVendedor);

/**
 * @swagger
 * /vendedores/numero/{numeroVendedor}/{empresaId}:
 *   get:
 *     summary: Obtiene un vendedor por número y empresa
 *     tags: [Vendedores]
 *     parameters:
 *       - in: path
 *         name: numeroVendedor
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: empresaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vendedor encontrado
 *       404:
 *         description: Vendedor no encontrado
 */
router.get('/numero/:numeroVendedor/:empresaId', getVendedorByNumero);

/**
 * @swagger
 * /vendedores:
 *   get:
 *     summary: Obtiene todos los vendedores
 *     tags: [Vendedores]
 *     responses:
 *       200:
 *         description: Lista de vendedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vendedor'
 */
router.get('/', getVendedores);

/**
 * @swagger
 * /vendedores:
 *   post:
 *     summary: Crea un nuevo vendedor
 *     tags: [Vendedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendedor'
 *     responses:
 *       201:
 *         description: Vendedor creado
 */
router.post('/', createVendedor);

/**
 * @swagger
 * /vendedores/{id}:
 *   get:
 *     summary: Obtiene un vendedor por ID interno
 *     tags: [Vendedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vendedor encontrado
 *       404:
 *         description: Vendedor no encontrado
 */
router.get('/:id', getVendedorById);

/**
 * @swagger
 * /vendedores/{id}:
 *   put:
 *     summary: Actualiza un vendedor
 *     tags: [Vendedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendedor'
 *     responses:
 *       200:
 *         description: Vendedor actualizado
 */
router.put('/:id', updateVendedor);

/**
 * @swagger
 * /vendedores/{id}:
 *   delete:
 *     summary: Elimina un vendedor
 *     tags: [Vendedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Vendedor eliminado
 */
router.delete('/:id', deleteVendedor);

export default router;