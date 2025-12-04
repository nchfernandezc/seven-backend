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
 *             required:
 *               - numero
 *               - articuloCodigo
 *               - cantidad
 *               - precioVenta
 *               - clienteCodigo
 *               - usuario
 *             properties:
 *               numero:
 *                 type: string
 *                 description: Número de pedido
 *               articuloCodigo:
 *                 type: string
 *                 description: Código del artículo
 *               cantidad:
 *                 type: number
 *                 format: float
 *                 description: Cantidad del artículo
 *               precioVenta:
 *                 type: number
 *                 format: float
 *                 description: Precio de venta unitario
 *               clienteCodigo:
 *                 type: string
 *                 description: Código del cliente
 *               estado:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 description: 1: Pendiente, 2: Procesado, 3: Anulado
 *                 default: 1
 *               usuario:
 *                 type: string
 *                 description: Usuario que crea el pedido
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Datos del pedido inválidos
 */
router.post('/', pedido_controller_1.createPedido);
/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Actualiza un pedido existente
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no encontrado
 */
router.put('/:id', pedido_controller_1.updatePedido);
/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Elimina un pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a eliminar
 *     responses:
 *       204:
 *         description: Pedido eliminado exitosamente
 *       404:
 *         description: Pedido no encontrado
 */
router.delete('/:id', pedido_controller_1.deletePedido);
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
/**
 * @swagger
 * /pedidos/articulo/{articuloCodigo}:
 *   get:
 *     summary: Obtiene los pedidos de un artículo
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: articuloCodigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del artículo
 *     responses:
 *       200:
 *         description: Lista de pedidos del artículo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get('/articulo/:articuloCodigo', pedido_controller_1.getPedidosByArticulo);
exports.default = router;
