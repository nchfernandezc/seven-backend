"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const database_1 = require("../config/database");
const Usuario_1 = require("../entities/Usuario");
const usuarioRepository = database_1.AppDataSource.getRepository(Usuario_1.Usuario);
/**
 * Valida las credenciales de un vendedor/usuario (Configuración inicial)
 * Se consulta la tabla 'a_usuario'
 */
const login = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Sesión cerrada correctamente'
    });
};
exports.logout = logout;
