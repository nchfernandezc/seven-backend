import { Router } from 'express';
import { 
  getArticulos, 
  getArticuloById, 
} from '../controllers/articulo.controller';

const router = Router();

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
router.get('/', getArticulos);

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
router.get('/:id', getArticuloById);

export default router;