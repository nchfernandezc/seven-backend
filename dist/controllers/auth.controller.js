"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarVendedor = void 0;
const database_1 = require("../config/database");
const Usuario_1 = require("../entities/Usuario");
const usuarioRepository = database_1.AppDataSource.getRepository(Usuario_1.Usuario);
/**
 * Valida las credenciales de un vendedor/usuario (Configuración inicial)
 * Se consulta la tabla 'a_usuario'
 */
const validarVendedor = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error al validar vendedor (a_usuario):', error);
        res.status(500).json({
            success: false,
            message: 'Error al validar el vendedor'
        });
    }
};
exports.validarVendedor = validarVendedor;
