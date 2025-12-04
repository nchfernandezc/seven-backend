// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Vendedor } from '../entities/Vendedor';

const vendedorRepository = AppDataSource.getRepository(Vendedor);

export const validarVendedor = async (req: Request, res: Response) => {
    try {
        const { empresaId, numeroVendedor } = req.params;
        
        const vendedor = await vendedorRepository.findOne({
            where: {
                codigo: numeroVendedor,
                empresa: { id: parseInt(empresaId) }
            },
            relations: ['empresa']
        });

        if (!vendedor) {
            return res.status(404).json({ 
                success: false,
                message: 'Vendedor no encontrado o no pertenece a la empresa' 
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
        console.error('Error al validar vendedor:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al validar el vendedor' 
        });
    }
};