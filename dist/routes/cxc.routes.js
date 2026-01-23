"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cxc_controller_1 = require("../controllers/cxc.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Cuentas por Cobrar
 *   description: Gestión de cuentas por cobrar
 */
/**
 * @swagger
 * /cuentas-por-cobrar:
 *   get:
 *     summary: Obtiene todas las cuentas por cobrar
 *     tags: [Cuentas por Cobrar]
 *     responses:
 *       200:
 *         description: Lista de cuentas por cobrar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cxcobrar'
 */
router.get('/', cxc_controller_1.getCxcs);
/**
 * @swagger
 * /cuentas-por-cobrar/{id}:
 *   get:
 *     summary: Obtiene una cuenta por cobrar por ID
 *     tags: [Cuentas por Cobrar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta por cobrar
 *     responses:
 *       200:
 *         description: Cuenta por cobrar encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cxcobrar'
 *       404:
 *         description: Cuenta por cobrar no encontrada
 */
router.get('/:id', cxc_controller_1.getCxcById);
exports.default = router;
