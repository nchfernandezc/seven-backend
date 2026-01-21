// Update src/routes/sync.routes.ts with Swagger documentation

import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';
import { Articulo } from '../entities/Articulo';
import { Cliente } from '../entities/Cliente';
import { Cxcobrar } from '../entities/Cxcobrar';
import { Empresa } from '../entities/Empresa';
import { Pedido } from '../entities/Pedido';
import { Usuario } from '../entities/Usuario';

const router = Router();

// Register all entities that need synchronization
SyncController.registerEntities({
    articulo: Articulo as any,
    cliente: Cliente as any,
    cxcobrar: Cxcobrar as any,
    empresa: Empresa as any,
    pedido: Pedido as any,
    vendedor: Usuario as any,
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
router.post('/sync/init', SyncController.initSync);

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
router.post('/sync/push', SyncController.pushChanges);

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
router.post('/sync/pull', SyncController.pullChanges);

export default router;