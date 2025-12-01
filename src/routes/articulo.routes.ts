// src/routes/articulo.routes.ts
import { Router } from 'express';
import { 
  getArticulos, 
  getArticuloById, 
  createArticulo, 
  updateArticulo, 
  deleteArticulo 
} from '../controllers/articulo.controller';

const router = Router();

// Obtener todos los artículos
router.get('/', getArticulos);

// Obtener un artículo por ID
router.get('/:id', getArticuloById);

// Crear un nuevo artículo
router.post('/', createArticulo);

// Actualizar un artículo existente
router.put('/:id', updateArticulo);

// Eliminar un artículo
router.delete('/:id', deleteArticulo);

export default router;