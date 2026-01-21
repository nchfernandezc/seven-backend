import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';

const usuarioRepository = AppDataSource.getRepository(Usuario);

/**
 * Valida las credenciales de un vendedor/usuario (Configuración inicial)
 * Se consulta la tabla 'a_usuario'
 */
export const validarVendedor = async (req: Request, res: Response) => {
    try {
        const { empresaId, numeroVendedor } = req.params;

        // User Refactor: "Where vendedor = vendedor_apk and id=id_apk"
        // empresaId maps to id_apk (Usuario.id)
        // numeroVendedor maps to vendedor_apk (Usuario.vendedor)
        const usuario = await usuarioRepository.findOne({
            where: {
                id: Number(empresaId),
                vendedor: numeroVendedor
            }
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario/Vendedor no encontrado en a_usuario'
            });
        }

        res.json({
            success: true,
            data: {
                id: usuario.id, // id_apk
                vendedor: usuario.vendedor, // vendedor_apk
                usuario: usuario.usuario,
                detalle: usuario.detalle,
                // Do not return password (contraseña) unless explicitly needed
            }
        });
    } catch (error) {
        console.error('Error al validar vendedor (a_usuario):', error);
        res.status(500).json({
            success: false,
            message: 'Error al validar el vendedor'
        });
    }
};