import { Router } from 'express';
import { 
  getArticulos, 
  getArticuloById, 
  createArticulo, 
  updateArticulo, 
  deleteArticulo 
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
router.post('/', createArticulo);

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
router.put('/:id', updateArticulo);

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
router.delete('/:id', deleteArticulo);

export default router;