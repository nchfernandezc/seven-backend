import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';

const usuarioRepository = AppDataSource.getRepository(Usuario);

/**
 * Valida las credenciales de un usuario (tabla a_usuario)
 */
export const login = async (req: Request, res: Response) => {
    try {
        console.log('--- LOGIN ATTEMPT ---');
        console.log('Body received:', JSON.stringify(req.body, null, 2));

        // Forzamos el uso de 'clave'
        const username = req.body.username || req.body.usuario;
        const clave = req.body.clave || req.body.contra || req.body.password;

        if (!username || !clave) {
            console.log('Validation failed: Username or clave missing in body');
            return res.status(400).json({
                success: false,
                message: 'Usuario y clave son requeridos'
            });
        }

        const user = await usuarioRepository.findOne({
            where: {
                usuario: username,
                clave: clave
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Retornamos los datos necesarios para la app envueltos en success/data
        res.json({
            success: true,
            data: {
                id: user.id,          // ID de empresa
                vendedor: user.vendedor, // ID de vendedor
                usuario: user.usuario,
                detalle: user.detalle,
                clave: user.clave
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error'
        });
    }
};

/**
 * Finaliza la sesión
 */
export const logout = async (_req: Request, res: Response) => {
    res.json({ message: 'Sesión cerrada correctamente' });
};