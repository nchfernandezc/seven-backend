"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/empresa.routes.ts
const express_1 = require("express");
const empresa_controller_1 = require("../controllers/empresa.controller");
const router = (0, express_1.Router)();
router.get('/', empresa_controller_1.getEmpresas);
router.get('/:id', empresa_controller_1.getEmpresaById);
router.post('/', empresa_controller_1.createEmpresa);
router.put('/:id', empresa_controller_1.updateEmpresa);
router.delete('/:id', empresa_controller_1.deleteEmpresa);
exports.default = router;
