"use strict";
// Update src/routes/sync.routes.ts with Swagger documentation
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SyncController_1 = require("../controllers/SyncController");
const Articulo_1 = require("../entities/Articulo");
const Cliente_1 = require("../entities/Cliente");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const Empresa_1 = require("../entities/Empresa");
const Pedido_1 = require("../entities/Pedido");
const Vendedor_1 = require("../entities/Vendedor");
const router = (0, express_1.Router)();
// Register all entities that need synchronization
SyncController_1.SyncController.registerEntities({
    articulo: Articulo_1.Articulo,
    cliente: Cliente_1.Cliente,
    cxcobrar: Cxcobrar_1.Cxcobrar,
    empresa: Empresa_1.Empresa,
    pedido: Pedido_1.Pedido,
    vendedor: Vendedor_1.Vendedor,
});
/**
 * @swagger
 * /api/sync/init:
 *   post:
 *     summary: Initialize a sync session
 *     tags: [Sync]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the device
 *     responses:
 *       200:
 *         description: Sync session initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 syncToken:
 *                   type: string
 *                   description: Token to be used for subsequent sync operations
 */
router.post('/sync/init', SyncController_1.SyncController.initSync);
/**
 * @swagger
 * /api/sync/push:
 *   post:
 *     summary: Push changes from device to server
 *     tags: [Sync]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - changes
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the device
 *               changes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - entity
 *                     - operation
 *                     - data
 *                   properties:
 *                     entity:
 *                       type: string
 *                       enum: [articulo, cliente, cxcobrar, empresa, pedido, vendedor]
 *                     operation:
 *                       type: string
 *                       enum: [create, update, delete]
 *                     data:
 *                       type: object
 *     responses:
 *       200:
 *         description: Changes pushed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [created, updated, error]
 *                       error:
 *                         type: string
 */
router.post('/sync/push', SyncController_1.SyncController.pushChanges);
/**
 * @swagger
 * /api/sync/pull:
 *   post:
 *     summary: Pull changes from server to device
 *     tags: [Sync]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier for the device
 *               lastSyncToken:
 *                 type: string
 *                 description: The sync token from the last successful sync
 *     responses:
 *       200:
 *         description: Changes pulled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 changes:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/SyncLog'
 *                 syncToken:
 *                   type: string
 *                   description: Token to be used for the next sync
 */
router.post('/sync/pull', SyncController_1.SyncController.pullChanges);
exports.default = router;
