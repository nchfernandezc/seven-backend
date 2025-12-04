// src/routes/auth.routes.ts
import { Router } from 'express';
import { validarVendedor } from '../controllers/auth.controller';

const router = Router();

router.get('/validar-vendedor/:empresaId/:numeroVendedor', validarVendedor);

export default router;