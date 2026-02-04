"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticulo = exports.updateArticulo = exports.createArticulo = exports.getArticuloById = exports.getArticulos = void 0;
const database_1 = require("../config/database");
const tableName_1 = require("../utils/tableName");
const getArticulos = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId)
            return res.status(403).json({ message: 'Empresa no identificada' });
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        const query = database_1.AppDataSource.createQueryBuilder()
            .select('a.*')
            .from(tableName, 'a')
            .where('a.id = :empresaId', { empresaId });
        const articulos = await query.orderBy('a.cdet', 'ASC').getRawMany();
        res.json(articulos);
    }
    catch (error) {
        console.error('[Articulos] Error:', error);
        res.status(500).json({
            message: 'Error al obtener artículos',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getArticulos = getArticulos;
const getArticuloById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        const articulo = await database_1.AppDataSource.createQueryBuilder()
            .select('a.*')
            .from(tableName, 'a')
            .where('a.xxx = :id AND a.id = :empresaId', { id, empresaId })
            .getRawOne();
        if (!articulo)
            return res.status(404).json({ message: 'Artículo no encontrado' });
        res.json(articulo);
    }
    catch (error) {
        console.error('[Articulos] GetById Error:', error);
        res.status(500).json({ message: 'Error al obtener artículo' });
    }
};
exports.getArticuloById = getArticuloById;
// Placeholder functions if they are imported in routes
const createArticulo = async (req, res) => {
    res.status(501).json({ message: 'No implementado' });
};
exports.createArticulo = createArticulo;
const updateArticulo = async (req, res) => {
    res.status(501).json({ message: 'No implementado' });
};
exports.updateArticulo = updateArticulo;
const deleteArticulo = async (req, res) => {
    res.status(501).json({ message: 'No implementado' });
};
exports.deleteArticulo = deleteArticulo;
