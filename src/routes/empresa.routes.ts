// src/routes/empresa.routes.ts
import { Router } from 'express';
import {
    getEmpresas,
    getEmpresaById,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa
} from '../controllers/empresa.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: Gestión de empresas
 */

/**
 * @swagger
 * /empresas:
 *   get:
 *     summary: Obtiene todas las empresas
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 */
router.get('/', getEmpresas);

/**
 * @swagger
 * /empresas/{id}:
 *   get:
 *     summary: Obtiene una empresa por ID
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       404:
 *         description: Empresa no encontrada
 */
router.get('/:id', getEmpresaById);

/**
 * @swagger
 * /empresas:
 *   post:
 *     summary: Crea una nueva empresa
 *     tags: [Empresas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', createEmpresa);

/**
 * @swagger
 * /empresas/{id}:
 *   put:
 *     summary: Actualiza una empresa existente
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       200:
 *         description: Empresa actualizada
 *       404:
 *         description: Empresa no encontrada
 */
router.put('/:id', updateEmpresa);

/**
 * @swagger
 * /empresas/{id}:
 *   delete:
 *     summary: Elimina una empresa
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa a eliminar
 *     responses:
 *       204:
 *         description: Empresa eliminada
 *       404:
 *         description: Empresa no encontrada
 */
router.delete('/:id', deleteEmpresa);

export default router;