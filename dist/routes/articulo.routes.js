"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articulo_controller_1 = require("../controllers/articulo.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Artículos
 *   description: Gestión de artículos
 */
/**
 * @swagger
 * /articulos:
 *   get:
 *     summary: Obtiene todos los artículos
 *     tags: [Artículos]
 *     responses:
 *       200:
 *         description: Lista de artículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Articulo'
 */
router.get('/', articulo_controller_1.getArticulos);
/**
 * @swagger
 * /articulos/{id}:
 *   get:
 *     summary: Obtiene un artículo por ID
 *     tags: [Artículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *       404:
 *         description: Artículo no encontrado
 */
router.get('/:id', articulo_controller_1.getArticuloById);
/**
 * @swagger
 * /articulos:
 *   post:
 *     summary: Crea un nuevo artículo
 *     tags: [Artículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Articulo'
 *     responses:
 *       201:
 *         description: Artículo creado exitosamente
 *       400:
 *         description: Datos del artículo inválidos
 */
router.post('/', articulo_controller_1.createArticulo);
/**
 * @swagger
 * /articulos/{id}:
 *   put:
 *     summary: Actualiza un artículo existente
 *     tags: [Artículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artículo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Articulo'
 *     responses:
 *       200:
 *         description: Artículo actualizado
 *       404:
 *         description: Artículo no encontrado
 */
router.put('/:id', articulo_controller_1.updateArticulo);
/**
 * @swagger
 * /articulos/{id}:
 *   delete:
 *     summary: Elimina un artículo
 *     tags: [Artículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del artículo a eliminar
 *     responses:
 *       204:
 *         description: Artículo eliminado
 *       404:
 *         description: Artículo no encontrado
 */
router.delete('/:id', articulo_controller_1.deleteArticulo);
exports.default = router;
