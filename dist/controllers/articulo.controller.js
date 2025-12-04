"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticulo = exports.updateArticulo = exports.createArticulo = exports.getArticuloById = exports.getArticulos = void 0;
const database_1 = require("../config/database");
const Articulo_1 = require("../entities/Articulo");
const articuloRepository = database_1.AppDataSource.getRepository(Articulo_1.Articulo);
const getArticulos = async (req, res) => {
    try {
        const articulos = await articuloRepository.find();
        res.json(articulos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los artículos', error });
    }
};
exports.getArticulos = getArticulos;
const getArticuloById = async (req, res) => {
    try {
        const { id } = req.params;
        const articulo = await articuloRepository.findOneBy({ id: Number(id) });
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.json(articulo);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el artículo', error });
    }
};
exports.getArticuloById = getArticuloById;
const createArticulo = async (req, res) => {
    try {
        const articulo = articuloRepository.create(req.body);
        const resultado = await articuloRepository.save(articulo);
        res.status(201).json(resultado);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear el artículo', error });
    }
};
exports.createArticulo = createArticulo;
const updateArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        const articulo = await articuloRepository.findOneBy({ id: Number(id) });
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        articuloRepository.merge(articulo, req.body);
        const resultado = await articuloRepository.save(articulo);
        res.json(resultado);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el artículo', error });
    }
};
exports.updateArticulo = updateArticulo;
const deleteArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await articuloRepository.delete(id);
        if (resultado.affected === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el artículo', error });
    }
};
exports.deleteArticulo = deleteArticulo;
