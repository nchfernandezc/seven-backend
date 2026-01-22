import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';

const usuarioRepository = AppDataSource.getRepository(Usuario);

/**
 * Valida las credenciales de un vendedor/usuario (Configuración inicial)
 * Se consulta la tabla 'a_usuario'
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        const user = await usuarioRepository.findOne({
            where: {
                usuario: usuario,
                contra: password // Mapping 'contraseña' column which is 'contra' in entity
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        res.json({
            success: true,
            data: {
                id: user.id, // id_apk -> id (Empresa ID)
                vendedor: user.vendedor, // vendedor_apk -> vendedor (Vendedor ID)
                usuario: user.usuario,
                detalle: user.detalle
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Sesión cerrada correctamente'
    });
};