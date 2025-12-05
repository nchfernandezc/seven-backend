"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get('/validar-vendedor/:empresaId/:numeroVendedor', auth_controller_1.validarVendedor);
exports.default = router;
