"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/empresa.routes.ts
const express_1 = require("express");
const empresa_controller_1 = require("../controllers/empresa.controller");
const router = (0, express_1.Router)();
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
router.get('/', empresa_controller_1.getEmpresas);
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
router.get('/:id', empresa_controller_1.getEmpresaById);
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
router.post('/', empresa_controller_1.createEmpresa);
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
router.put('/:id', empresa_controller_1.updateEmpresa);
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
router.delete('/:id', empresa_controller_1.deleteEmpresa);
exports.default = router;
