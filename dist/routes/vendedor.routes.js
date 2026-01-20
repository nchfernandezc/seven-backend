"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/vendedor.routes.ts
const express_1 = require("express");
const vendedor_controller_1 = require("../controllers/vendedor.controller");
const router = (0, express_1.Router)();
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
router.post('/validate', vendedor_controller_1.validateVendedor);
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
router.get('/numero/:numeroVendedor/:empresaId', vendedor_controller_1.getVendedorByNumero);
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
router.get('/', vendedor_controller_1.getVendedores);
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
router.post('/', vendedor_controller_1.createVendedor);
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
router.get('/:id', vendedor_controller_1.getVendedorById);
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
router.put('/:id', vendedor_controller_1.updateVendedor);
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
router.delete('/:id', vendedor_controller_1.deleteVendedor);
exports.default = router;
