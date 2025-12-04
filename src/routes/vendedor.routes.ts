// src/routes/vendedor.routes.ts
import { Router } from 'express';
import { 
    getVendedores, 
    getVendedorById, 
    createVendedor, 
    updateVendedor, 
    deleteVendedor, 
    getVendedorByNumero
} from '../controllers/vendedor.controller';

const router = Router();

// Asegúrate de agregar autenticación y validación según sea necesario
router.get('/', getVendedores);
router.get('/:id', getVendedorById);
router.post('/', createVendedor);
router.put('/:id', updateVendedor);
router.delete('/:id', deleteVendedor);
router.get('/numero/:numeroVendedor/:empresaId', getVendedorByNumero);

export default router;