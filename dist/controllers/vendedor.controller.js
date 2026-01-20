"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVendedor = exports.getVendedorByNumero = exports.deleteVendedor = exports.updateVendedor = exports.createVendedor = exports.getVendedorById = exports.getVendedores = void 0;
const database_1 = require("../config/database");
const Vendedor_1 = require("../entities/Vendedor");
const Empresa_1 = require("../entities/Empresa");
const vendedorRepository = database_1.AppDataSource.getRepository(Vendedor_1.Vendedor);
const empresaRepository = database_1.AppDataSource.getRepository(Empresa_1.Empresa);
/**
 * Obtiene todos los vendedores
 */
const getVendedores = async (req, res) => {
    try {
        const vendedores = await vendedorRepository.find({
            relations: ['empresa']
        });
        res.json(vendedores);
    }
    catch (error) {
        console.error('Error al obtener vendedores:', error);
        res.status(500).json({ message: 'Error al obtener los vendedores' });
    }
};
exports.getVendedores = getVendedores;
/**
 * Obtiene un vendedor por ID
 */
const getVendedorById = async (req, res) => {
    try {
        const vendedor = await vendedorRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['empresa']
        });
        if (!vendedor) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }
        res.json(vendedor);
    }
    catch (error) {
        console.error('Error al obtener vendedor:', error);
        res.status(500).json({ message: 'Error al obtener el vendedor' });
    }
};
exports.getVendedorById = getVendedorById;
/**
 * Crea un nuevo vendedor
 */
const createVendedor = async (req, res) => {
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
        const vendedor = await vendedorRepository.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (!vendedor) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }
        vendedorRepository.merge(vendedor, req.body);
        const result = await vendedorRepository.save(vendedor);
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
        const result = await vendedorRepository.delete(parseInt(req.params.id));
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
