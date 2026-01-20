"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmpresa = exports.updateEmpresa = exports.createEmpresa = exports.getEmpresaById = exports.getEmpresas = void 0;
const database_1 = require("../config/database");
const Empresa_1 = require("../entities/Empresa");
const empresaRepository = database_1.AppDataSource.getRepository(Empresa_1.Empresa);
/**
 * Obtiene todas las empresas
 */
const getEmpresas = async (req, res) => {
    try {
        const empresas = await empresaRepository.find();
        res.json(empresas);
    }
    catch (error) {
        console.error('Error al obtener empresas:', error);
        res.status(500).json({ message: 'Error al obtener las empresas' });
    }
};
exports.getEmpresas = getEmpresas;
/**
 * Obtiene una empresa por ID
 */
const getEmpresaById = async (req, res) => {
    try {
        const empresa = await empresaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.json(empresa);
    }
    catch (error) {
        console.error('Error al obtener empresa:', error);
        res.status(500).json({ message: 'Error al obtener la empresa' });
    }
};
exports.getEmpresaById = getEmpresaById;
/**
 * Crea una nueva empresa
 */
const createEmpresa = async (req, res) => {
    try {
        const empresa = empresaRepository.create(req.body);
        const result = await empresaRepository.save(empresa);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error al crear empresa:', error);
        res.status(500).json({ message: 'Error al crear la empresa' });
    }
};
exports.createEmpresa = createEmpresa;
/**
 * Actualiza una empresa existente
 */
const updateEmpresa = async (req, res) => {
    try {
        const empresa = await empresaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        empresaRepository.merge(empresa, req.body);
        const result = await empresaRepository.save(empresa);
        res.json(result);
    }
    catch (error) {
        console.error('Error al actualizar empresa:', error);
        res.status(500).json({ message: 'Error al actualizar la empresa' });
    }
};
exports.updateEmpresa = updateEmpresa;
/**
 * Elimina una empresa
 */
const deleteEmpresa = async (req, res) => {
    try {
        const result = await empresaRepository.delete(parseInt(req.params.id));
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error al eliminar empresa:', error);
        res.status(500).json({ message: 'Error al eliminar la empresa' });
    }
};
exports.deleteEmpresa = deleteEmpresa;
