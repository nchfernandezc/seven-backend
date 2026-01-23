"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articulo_routes_1 = __importDefault(require("./articulo.routes"));
const cliente_routes_1 = __importDefault(require("./cliente.routes"));
const cxc_routes_1 = __importDefault(require("./cxc.routes"));
const pedido_routes_1 = __importDefault(require("./pedido.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const stats_routes_1 = __importDefault(require("./stats.routes"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api:
 *   get:
 *     summary: Verifica que la API esté funcionando
 *     tags: [API]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: 'API de Gestión de Pedidos - Funcionando'
 *               version: '1.0.0'
 */
router.get('/', (req, res) => {
    res.json({ message: 'API de Gestión de Pedidos - Funcionando', version: '1.0.0' });
});
// API Routes
router.use('/api/articulos', articulo_routes_1.default);
router.use('/api/clientes', cliente_routes_1.default);
router.use('/api/cuentas-por-cobrar', cxc_routes_1.default);
router.use('/api/pedidos', pedido_routes_1.default);
router.use('/api/auth', auth_routes_1.default);
router.use('/api/stats', stats_routes_1.default);
exports.default = router;
