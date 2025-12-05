// src/routes/vendedor.routes.ts
import { Router } from 'express';
import {
    getVendedores,
    getVendedorById,
    createVendedor,
    updateVendedor,
    deleteVendedor,
    getVendedorByNumero,
    validateVendedor
} from '../controllers/vendedor.controller';

const router = Router();

// Rutas específicas primero (antes de las rutas con parámetros)
router.post('/validate', validateVendedor);
router.get('/numero/:numeroVendedor/:empresaId', getVendedorByNumero);

// Rutas generales
router.get('/', getVendedores);
router.post('/', createVendedor);

// Rutas con parámetros al final
router.get('/:id', getVendedorById);
router.put('/:id', updateVendedor);
router.delete('/:id', deleteVendedor);

export default router;