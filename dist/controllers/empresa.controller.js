"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmpresa = exports.updateEmpresa = exports.createEmpresa = exports.getEmpresaById = exports.getEmpresas = void 0;
const database_1 = require("../config/database");
const Empresa_1 = require("../entities/Empresa");
const empresaRepository = database_1.AppDataSource.getRepository(Empresa_1.Empresa);
const getEmpresas = async (req, res) => {
    try {
        const empresas = await empresaRepository.find();
        res.json(empresas);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener las empresas' });
    }
};
exports.getEmpresas = getEmpresas;
const getEmpresaById = async (req, res) => {
    try {
        const empresa = await empresaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!empresa)
            return res.status(404).json({ message: 'Empresa no encontrada' });
        res.json(empresa);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener la empresa' });
    }
};
exports.getEmpresaById = getEmpresaById;
const createEmpresa = async (req, res) => {
    try {
        const empresa = empresaRepository.create(req.body);
        const result = await empresaRepository.save(empresa);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la empresa' });
    }
};
exports.createEmpresa = createEmpresa;
const updateEmpresa = async (req, res) => {
    try {
        const empresa = await empresaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!empresa)
            return res.status(404).json({ message: 'Empresa no encontrada' });
        empresaRepository.merge(empresa, req.body);
        const result = await empresaRepository.save(empresa);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la empresa' });
    }
};
exports.updateEmpresa = updateEmpresa;
const deleteEmpresa = async (req, res) => {
    try {
        const result = await empresaRepository.delete(parseInt(req.params.id));
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar la empresa' });
    }
};
exports.deleteEmpresa = deleteEmpresa;
