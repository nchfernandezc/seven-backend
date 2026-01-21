"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVendedor = exports.getVendedorByNumero = exports.deleteVendedor = exports.updateVendedor = exports.createVendedor = exports.getVendedorById = exports.getVendedores = void 0;
const database_1 = require("../config/database");
const Usuario_1 = require("../entities/Usuario");
const Empresa_1 = require("../entities/Empresa");
const usuarioRepository = database_1.AppDataSource.getRepository(Usuario_1.Usuario);
const empresaRepository = database_1.AppDataSource.getRepository(Empresa_1.Empresa);
/**
 * Obtiene todos los vendedores (Usuarios)
 */
const getVendedores = async (req, res) => {
    try {
        const { empresaId } = req.query;
        // Filter by empresaId (Usuario.id) if provided
        const whereCondition = empresaId ? { id: Number(empresaId) } : {};
        const vendedores = await usuarioRepository.find({
            where: whereCondition
        });
        // Map to expected format
        const response = vendedores.map(u => ({
            id: u.internalId, // Use internal ID or primary key if needed
            codigo: u.vendedor,
            nombre: u.usuario, // Or u.detalle
            telefono: '', // Not in a_usuario
            empresaId: u.id
        }));
        res.json(response);
    }
    catch (error) {
        console.error('Error al obtener vendedores:', error);
        res.status(500).json({ message: 'Error al obtener los vendedores' });
    }
};
exports.getVendedores = getVendedores;
/**
 * Obtiene un vendedor por ID (internalId)
 */
const getVendedorById = async (req, res) => {
    try {
        const vendedor = await usuarioRepository.findOne({
            where: { internalId: parseInt(req.params.id) }
        });
        if (!vendedor) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }
        res.json({
            id: vendedor.internalId,
            codigo: vendedor.vendedor,
            nombre: vendedor.usuario,
            empresaId: vendedor.id
        });
    }
    catch (error) {
        console.error('Error al obtener vendedor:', error);
        res.status(500).json({ message: 'Error al obtener el vendedor' });
    }
};
exports.getVendedorById = getVendedorById;
/**
 * Crea un nuevo vendedor (Usuario)
 */
const createVendedor = async (req, res) => {
    try {
        // This might be separate from normal Vendedor creation. 
        // Assuming we create an entry in a_usuario.
        const { empresaId, codigo, nombre, password } = req.body;
        const empresa = await empresaRepository.findOneBy({ id: empresaId });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        const nuevoUsuario = usuarioRepository.create({
            id: empresaId,
            vendedor: codigo,
            usuario: nombre,
            detalle: nombre, // Default detail to name
            contra: password || '123456' // Default password if not provided
        });
        const result = await usuarioRepository.save(nuevoUsuario);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error al crear vendedor:', error);
        res.status(500).json({ message: 'Error al crear el vendedor' });
    }
};
exports.createVendedor = createVendedor;
/**
 * Actualiza un vendedor existente
 */
const updateVendedor = async (req, res) => {
    try {
        const vendedor = await usuarioRepository.findOne({
            where: { internalId: parseInt(req.params.id) }
        });
        if (!vendedor) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }
        // Map incoming fields to Usuario fields
        if (req.body.nombre)
            vendedor.usuario = req.body.nombre;
        if (req.body.codigo)
            vendedor.vendedor = req.body.codigo;
        const result = await usuarioRepository.save(vendedor);
        res.json(result);
    }
    catch (error) {
        console.error('Error al actualizar vendedor:', error);
        res.status(500).json({ message: 'Error al actualizar el vendedor' });
    }
};
exports.updateVendedor = updateVendedor;
/**
 * Elimina un vendedor
 */
const deleteVendedor = async (req, res) => {
    try {
        const result = await usuarioRepository.delete(parseInt(req.params.id));
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error al eliminar vendedor:', error);
        res.status(500).json({ message: 'Error al eliminar el vendedor' });
    }
};
exports.deleteVendedor = deleteVendedor;
/**
 * Obtiene un vendedor por código y empresa
 */
const getVendedorByNumero = async (req, res) => {
    try {
        const { numeroVendedor, empresaId } = req.params;
        const vendedor = await usuarioRepository.findOne({
            where: {
                vendedor: numeroVendedor,
                id: parseInt(empresaId)
            }
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
                id: vendedor.id, // empresaId/id_apk
                internalId: vendedor.internalId,
                codigo: vendedor.vendedor,
                nombre: vendedor.usuario,
                telefono: '',
                empresa: {
                    id: vendedor.id,
                    nombre: 'Empresa ' + vendedor.id // Placeholder if no join
                }
            }
        });
    }
    catch (error) {
        console.error('Error al buscar vendedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar el vendedor'
        });
    }
};
exports.getVendedorByNumero = getVendedorByNumero;
/**
 * Valida las credenciales de un vendedor para configuración inicial
 */
const validateVendedor = async (req, res) => {
    try {
        const { codigo, empresaId } = req.body;
        if (!codigo || !empresaId) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el código del vendedor y el ID de la empresa'
            });
        }
        // Search in a_usuarios using Usuario entity
        const vendedor = await usuarioRepository.findOne({
            where: {
                vendedor: codigo.toString().trim(),
                id: parseInt(empresaId)
            }
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
                codigo: vendedor.vendedor,
                nombre: vendedor.usuario,
                telefono: null,
                empresa: {
                    id: vendedor.id,
                    nombre: 'Empresa ' + vendedor.id, // We could fetch proper name if needed
                    identificacion: ''
                }
            }
        });
    }
    catch (error) {
        console.error('Error al validar vendedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al validar el vendedor'
        });
    }
};
exports.validateVendedor = validateVendedor;
