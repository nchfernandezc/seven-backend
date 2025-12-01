import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Articulo } from '../entities/Articulo';

const articuloRepository = AppDataSource.getRepository(Articulo);

export const getArticulos = async (req: Request, res: Response) => {
  try {
    const articulos = await articuloRepository.find();
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los artículos', error });
  }
};

export const getArticuloById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const articulo = await articuloRepository.findOneBy({ id: Number(id) });
    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json(articulo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el artículo', error });
  }
};

export const createArticulo = async (req: Request, res: Response) => {
  try {
    const articulo = articuloRepository.create(req.body);
    const resultado = await articuloRepository.save(articulo);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el artículo', error });
  }
};

export const updateArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const articulo = await articuloRepository.findOneBy({ id: Number(id) });
    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    articuloRepository.merge(articulo, req.body);
    const resultado = await articuloRepository.save(articulo);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el artículo', error });
  }
};

export const deleteArticulo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await articuloRepository.delete(id);
    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el artículo', error });
  }
};