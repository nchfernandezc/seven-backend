"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/pedido.routes.ts
const express_1 = require("express");
const pedido_controller_1 = require("../controllers/pedido.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gestión de pedidos
 */
/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Obtiene todos los pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get('/', pedido_controller_1.getPedidos);
/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Obtiene un pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', pedido_controller_1.getPedidoById);
/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num: { type: string }
 *               cod: { type: string }
 *               des: { type: string }
 *               can: { type: number }
 *               pre: { type: number }
 *               cli: { type: string }
 *     responses:
 *       201:
 *         description: Pedido creado
 */
router.post('/', pedido_controller_1.createPedido);
/**
 * @swagger
 * /pedidos/cliente/{clienteId}:
 *   get:
 *     summary: Obtiene los pedidos de un cliente
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del cliente
 *     responses:
 *       200:
 *         description: Lista de pedidos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get('/cliente/:clienteId', pedido_controller_1.getPedidosByCliente);
exports.default = router;
