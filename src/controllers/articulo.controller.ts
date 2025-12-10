import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Articulo } from '../entities/Articulo';

const articuloRepository = AppDataSource.getRepository(Articulo);

// Extensión del tipo Request para incluir datos de usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        empresaId: number;
        vendedorId?: string;
      };
    }
  }
}

/**
 * Obtiene todos los artículos de una empresa
 */
export const getArticulos = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const articulos = await articuloRepository.find({
      where: { empresaId },
      order: { descripcion: 'ASC' }
    });
    res.json(articulos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener artículos:', error);
    res.status(500).json({ message: 'Error al obtener los artículos', error: errorMessage });
  }
};

/**
 * Obtiene un artículo por ID
 */
export const getArticuloById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const articulo = await articuloRepository.findOne({
      where: { id: Number(id), empresaId }
    });

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json(articulo);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener artículo:', error);
    res.status(500).json({ message: 'Error al obtener el artículo', error: errorMessage });
  }
};

/**
 * Crea un nuevo artículo
 */
export const createArticulo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar código único por empresa
    const existingArticulo = await articuloRepository.findOne({
      where: {
        codigo: req.body.codigo,
        empresaId
      }
    });

    if (existingArticulo) {
      return res.status(400).json({
        message: 'El código de artículo ya existe'
      });
    }

    const articulo = articuloRepository.create({
      ...req.body,
      empresaId
    });

    const resultado = await articuloRepository.save(articulo);
    res.status(201).json(resultado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al crear artículo:', error);
    res.status(500).json({ message: 'Error al crear el artículo', error: errorMessage });
  }
};

/**
 * Actualiza un artículo existente
 */
export const updateArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const articulo = await articuloRepository.findOne({
      where: { id: Number(id), empresaId }
    });

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Verificar código único si se está actualizando
    if (req.body.codigo && req.body.codigo !== articulo.codigo) {
      const existingArticulo = await articuloRepository.findOne({
        where: {
          codigo: req.body.codigo,
          empresaId
        }
      });

      if (existingArticulo) {
        return res.status(400).json({
          message: 'El código de artículo ya existe'
        });
      }
    }

    articuloRepository.merge(articulo, req.body);
    const resultado = await articuloRepository.save(articulo);

    res.json(resultado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al actualizar artículo:', error);
    res.status(500).json({ message: 'Error al actualizar el artículo', error: errorMessage });
  }
};

/**
 * Elimina un artículo
 */
export const deleteArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const resultado = await articuloRepository.delete({
      id: Number(id),
      empresaId
    });

    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al eliminar artículo:', error);
    res.status(500).json({ message: 'Error al eliminar el artículo', error: errorMessage });
  }
};