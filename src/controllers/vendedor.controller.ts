import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Vendedor } from '../entities/Vendedor';
import { Empresa } from '../entities/Empresa';

const vendedorRepository = AppDataSource.getRepository(Vendedor);
const empresaRepository = AppDataSource.getRepository(Empresa);

/**
 * Obtiene todos los vendedores
 */
export const getVendedores = async (req: Request, res: Response) => {
    try {
        const vendedores = await vendedorRepository.find({
            relations: ['empresa']
        });
        res.json(vendedores);
    } catch (error) {
        console.error('Error al obtener vendedores:', error);
        res.status(500).json({ message: 'Error al obtener los vendedores' });
    }
};

/**
 * Obtiene un vendedor por ID
 */
export const getVendedorById = async (req: Request, res: Response) => {
    try {
        const vendedor = await vendedorRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['empresa']
        });

        if (!vendedor) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }

        res.json(vendedor);
    } catch (error) {
        console.error('Error al obtener vendedor:', error);
        res.status(500).json({ message: 'Error al obtener el vendedor' });
    }
};

/**
 * Crea un nuevo vendedor
 */
export const createVendedor = async (req: Request, res: Response) => {
    try {
        const { empresaId, ...vendedorData } = req.body;

        const empresa = await empresaRepository.findOneBy({ id: empresaId });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        const vendedor = vendedorRepository.create({
            ...vendedorData,
            empresa
        });

        const result = await vendedorRepository.save(vendedor);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear vendedor:', error);
        res.status(500).json({ message: 'Error al crear el vendedor' });
    }
};

/**
 * Actualiza un vendedor existente
 */
export const updateVendedor = async (req: Request, res: Response) => {
    try {
        const vendedor = await vendedorRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });

        if (!vendedor) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }

        vendedorRepository.merge(vendedor, req.body);
        const result = await vendedorRepository.save(vendedor);
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar vendedor:', error);
        res.status(500).json({ message: 'Error al actualizar el vendedor' });
    }
};

/**
 * Elimina un vendedor
 */
export const deleteVendedor = async (req: Request, res: Response) => {
    try {
        const result = await vendedorRepository.delete(parseInt(req.params.id));

        if (result.affected === 0) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar vendedor:', error);
        res.status(500).json({ message: 'Error al eliminar el vendedor' });
    }
};

/**
 * Obtiene un vendedor por código y empresa
 */
export const getVendedorByNumero = async (req: Request, res: Response) => {
    try {
        const { numeroVendedor, empresaId } = req.params;

        const vendedor = await vendedorRepository.findOne({
            where: {
                codigo: numeroVendedor,
                empresaId: parseInt(empresaId)
            },
            relations: ['empresa']
        });

        if (!vendedor) {
            return res.status(404).json({
                success: false,
                message: 'Vendedor no encontrado'
            });
        }

        res.json({
            success: true,
            data: {
                id: vendedor.id,
                codigo: vendedor.codigo,
                nombre: vendedor.nombre,
                telefono: vendedor.telefono,
                empresa: {
                    id: vendedor.empresa.id,
                    nombre: vendedor.empresa.nombre
                }
            }
        });
    } catch (error) {
        console.error('Error al buscar vendedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar el vendedor'
        });
    }
};

/**
 * Valida las credenciales de un vendedor para configuración inicial
 */
export const validateVendedor = async (req: Request, res: Response) => {
    try {
        const { codigo, empresaId } = req.body;

        if (!codigo || !empresaId) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el código del vendedor y el ID de la empresa'
            });
        }

        const vendedor = await vendedorRepository.findOne({
            where: {
                codigo: codigo.toString().trim(),
                empresaId: parseInt(empresaId)
            },
            relations: ['empresa']
        });

        if (!vendedor) {
            return res.status(404).json({
                success: false,
                message: 'Vendedor no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Vendedor validado correctamente',
            data: {
                id: vendedor.id,
                codigo: vendedor.codigo,
                nombre: vendedor.nombre,
                telefono: vendedor.telefono || null,
                empresa: {
                    id: vendedor.empresa.id,
                    nombre: vendedor.empresa.nombre,
                    identificacion: vendedor.empresa.identificacion
                }
            }
        });
    } catch (error) {
        console.error('Error al validar vendedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al validar el vendedor'
        });
    }
};