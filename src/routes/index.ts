// src/routes/index.ts
import { Router } from 'express';
import articuloRoutes from '../routes/articulo.routes';

const router = Router();

// Rutas de la API
router.use('/api/articulos', articuloRoutes);

export default router;