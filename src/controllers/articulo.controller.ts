import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Articulo } from '../entities/Articulo';

const articuloRepository = AppDataSource.getRepository(Articulo);

// Interfaz para extender el tipo Request de Express
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
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener los artículos';
    console.error('Error al obtener artículos:', error);
    res.status(500).json({ message: 'Error al obtener los artículos', error: errorMessage });
  }
};

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
      return res.status(404).json({ message: 'Artículo no encontrado o no pertenece a su empresa' });
    }
    
    res.json(articulo);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener el artículo';
    console.error('Error al obtener artículo:', error);
    res.status(500).json({ message: 'Error al obtener el artículo', error: errorMessage });
  }
};

export const createArticulo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar si ya existe un artículo con el mismo código en la misma empresa
    const existingArticulo = await articuloRepository.findOne({
      where: { 
        codigo: req.body.codigo,
        empresaId 
      }
    });

    if (existingArticulo) {
      return res.status(400).json({ 
        message: 'Ya existe un artículo con el mismo código en esta empresa' 
      });
    }

    const articulo = articuloRepository.create({
      ...req.body,
      empresaId // Asegurarse de que el artículo se asocie a la empresa del usuario
    });
    
    const resultado = await articuloRepository.save(articulo);
    res.status(201).json(resultado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear el artículo';
    console.error('Error al crear artículo:', error);
    res.status(500).json({ message: 'Error al crear el artículo', error: errorMessage });
  }
};

export const updateArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Buscar el artículo asegurando que pertenezca a la empresa
    const articulo = await articuloRepository.findOne({
      where: { id: Number(id), empresaId }
    });
    
    if (!articulo) {
      return res.status(404).json({ 
        message: 'Artículo no encontrado o no tiene permisos para modificarlo' 
      });
    }

    // Si se está actualizando el código, verificar que no exista otro con el mismo código
    if (req.body.codigo && req.body.codigo !== articulo.codigo) {
      const existingArticulo = await articuloRepository.findOne({
        where: { 
          codigo: req.body.codigo,
          empresaId 
        }
      });

      if (existingArticulo) {
        return res.status(400).json({ 
          message: 'Ya existe otro artículo con el mismo código en esta empresa' 
        });
      }
    }

    // Actualizar el artículo
    articuloRepository.merge(articulo, req.body);
    const resultado = await articuloRepository.save(articulo);
    
    res.json(resultado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar el artículo';
    console.error('Error al actualizar artículo:', error);
    res.status(500).json({ message: 'Error al actualizar el artículo', error: errorMessage });
  }
};

export const deleteArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar que el artículo pertenezca a la empresa antes de eliminarlo
    const resultado = await articuloRepository.delete({
      id: Number(id),
      empresaId
    });
    
    if (resultado.affected === 0) {
      return res.status(404).json({ 
        message: 'Artículo no encontrado o no tiene permisos para eliminarlo' 
      });
    }
    
    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el artículo';
    console.error('Error al eliminar artículo:', error);
    res.status(500).json({ message: 'Error al eliminar el artículo', error: errorMessage });
  }
};