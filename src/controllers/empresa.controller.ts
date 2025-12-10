import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Empresa } from '../entities/Empresa';

const empresaRepository = AppDataSource.getRepository(Empresa);

/**
 * Obtiene todas las empresas
 */
export const getEmpresas = async (req: Request, res: Response) => {
    try {
        const empresas = await empresaRepository.find();
        res.json(empresas);
    } catch (error) {
        console.error('Error al obtener empresas:', error);
        res.status(500).json({ message: 'Error al obtener las empresas' });
    }
};

/**
 * Obtiene una empresa por ID
 */
export const getEmpresaById = async (req: Request, res: Response) => {
    try {
        const empresa = await empresaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.json(empresa);
    } catch (error) {
        console.error('Error al obtener empresa:', error);
        res.status(500).json({ message: 'Error al obtener la empresa' });
    }
};

/**
 * Crea una nueva empresa
 */
export const createEmpresa = async (req: Request, res: Response) => {
    try {
        const empresa = empresaRepository.create(req.body);
        const result = await empresaRepository.save(empresa);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear empresa:', error);
        res.status(500).json({ message: 'Error al crear la empresa' });
    }
};

/**
 * Actualiza una empresa existente
 */
export const updateEmpresa = async (req: Request, res: Response) => {
    try {
        const empresa = await empresaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        empresaRepository.merge(empresa, req.body);
        const result = await empresaRepository.save(empresa);
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar empresa:', error);
        res.status(500).json({ message: 'Error al actualizar la empresa' });
    }
};

/**
 * Elimina una empresa
 */
export const deleteEmpresa = async (req: Request, res: Response) => {
    try {
        const result = await empresaRepository.delete(parseInt(req.params.id));
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar empresa:', error);
        res.status(500).json({ message: 'Error al eliminar la empresa' });
    }
};