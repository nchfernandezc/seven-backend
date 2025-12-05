"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/vendedor.routes.ts
const express_1 = require("express");
const vendedor_controller_1 = require("../controllers/vendedor.controller");
const router = (0, express_1.Router)();
// Rutas específicas primero (antes de las rutas con parámetros)
router.post('/validate', vendedor_controller_1.validateVendedor);
router.get('/numero/:numeroVendedor/:empresaId', vendedor_controller_1.getVendedorByNumero);
// Rutas generales
router.get('/', vendedor_controller_1.getVendedores);
router.post('/', vendedor_controller_1.createVendedor);
// Rutas con parámetros al final
router.get('/:id', vendedor_controller_1.getVendedorById);
router.put('/:id', vendedor_controller_1.updateVendedor);
router.delete('/:id', vendedor_controller_1.deleteVendedor);
exports.default = router;
