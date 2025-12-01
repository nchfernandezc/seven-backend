import { Router } from 'express';
import { 
  getCxcs, 
  getCxcById, 
  createCxc, 
  updateCxc, 
  deleteCxc,
  getCxcsByCliente
} from '../controllers/cxc.controller';

const router = Router();

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
router.get('/', getCxcs);

/**
 * @swagger
 * /cuentas-por-cobrar/cliente/{clienteId}:
 *   get:
 *     summary: Obtiene las cuentas por cobrar de un cliente
 *     tags: [Cuentas por Cobrar]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del cliente
 *     responses:
 *       200:
 *         description: Lista de cuentas por cobrar del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cxcobrar'
 */
router.get('/cliente/:clienteId', getCxcsByCliente);

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
router.get('/:id', getCxcById);

/**
 * @swagger
 * /cuentas-por-cobrar:
 *   post:
 *     summary: Crea una nueva cuenta por cobrar
 *     tags: [Cuentas por Cobrar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cxcobrar'
 *     responses:
 *       201:
 *         description: Cuenta por cobrar creada exitosamente
 *       400:
 *         description: Datos de la cuenta por cobrar inválidos
 */
router.post('/', createCxc);

/**
 * @swagger
 * /cuentas-por-cobrar/{id}:
 *   put:
 *     summary: Actualiza una cuenta por cobrar existente
 *     tags: [Cuentas por Cobrar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta por cobrar a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cxcobrar'
 *     responses:
 *       200:
 *         description: Cuenta por cobrar actualizada
 *       404:
 *         description: Cuenta por cobrar no encontrada
 */
router.put('/:id', updateCxc);

/**
 * @swagger
 * /cuentas-por-cobrar/{id}:
 *   delete:
 *     summary: Elimina una cuenta por cobrar
 *     tags: [Cuentas por Cobrar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuenta por cobrar a eliminar
 *     responses:
 *       204:
 *         description: Cuenta por cobrar eliminada
 *       404:
 *         description: Cuenta por cobrar no encontrada
 */
router.delete('/:id', deleteCxc);

export default router;