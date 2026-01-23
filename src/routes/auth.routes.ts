// src/routes/auth.routes.ts
import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión (Configuración inicial)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - contra
 *             properties:
 *               username:
 *                 type: string
 *               contra:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post('/logout', logout);

export default router;