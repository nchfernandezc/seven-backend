"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const database_1 = require("../config/database");
const Usuario_1 = require("../entities/Usuario");
const usuarioRepository = database_1.AppDataSource.getRepository(Usuario_1.Usuario);
/**
 * Valida las credenciales de un usuario (tabla a_usuario)
 */
const login = async (req, res) => {
    try {
        console.log('--- LOGIN ATTEMPT ---');
        console.log('Body received:', JSON.stringify(req.body, null, 2));
        // Compatibilidad con ambos formatos (APK usa usuario/password, Bruno/Web usa username/contra)
        const username = req.body.username || req.body.usuario;
        const contra = req.body.contra || req.body.password;
        if (!username || !contra) {
            console.log('Validation failed: Username or password missing in body');
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }
        const user = await usuarioRepository.findOne({
            where: {
                usuario: username,
                contra: contra
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
                id: user.id, // ID de empresa
                vendedor: user.vendedor, // ID de vendedor
                usuario: user.usuario,
                detalle: user.detalle
            }
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error'
        });
    }
};
exports.login = login;
/**
 * Finaliza la sesión
 */
const logout = async (_req, res) => {
    res.json({ message: 'Sesión cerrada correctamente' });
};
exports.logout = logout;
