// src/controllers/empresa.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Empresa } from '../entities/Empresa';

const empresaRepository = AppDataSource.getRepository(Empresa);

export const getEmpresas = async (req: Request, res: Response) => {
    try {
        const empresas = await empresaRepository.find();
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las empresas' });
    }
};

export const getEmpresaById = async (req: Request, res: Response) => {
    try {
        const empresa = await empresaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
        res.json(empresa);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la empresa' });
    }
};

export const createEmpresa = async (req: Request, res: Response) => {
    try {
        const empresa = empresaRepository.create(req.body);
        const result = await empresaRepository.save(empresa);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la empresa' });
    }
};

export const updateEmpresa = async (req: Request, res: Response) => {
    try {
        const empresa = await empresaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });
        
        empresaRepository.merge(empresa, req.body);
        const result = await empresaRepository.save(empresa);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la empresa' });
    }
};

export const deleteEmpresa = async (req: Request, res: Response) => {
    try {
        const result = await empresaRepository.delete(parseInt(req.params.id));
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la empresa' });
    }
};