import { Router } from 'express';
import { 
  getClientes, 
  getClienteById, 
  createCliente, 
  updateCliente, 
  deleteCliente,
  buscarClientes 
} from '../controllers/cliente.controller';

const router = Router();

router.get('/buscar', buscarClientes);

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.get('/', getClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtiene un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', getClienteById);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Datos del cliente inválidos
 */
router.post('/', createCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del cliente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', updateCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Elimina un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del cliente a eliminar
 *     responses:
 *       204:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', deleteCliente);

export default router;