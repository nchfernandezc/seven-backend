"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticuloById = exports.getArticulos = void 0;
const database_1 = require("../config/database");
const tableName_1 = require("../utils/tableName");
/**
 * Obtiene todos los artículos de una empresa
 */
const getArticulos = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId)
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        // Usamos QueryBuilder genérico para evitar conflictos con la metadata de la Entity
        // pero indicamos que queremos el resultado como tipo 'Articulo'
        const articulos = await database_1.AppDataSource.createQueryBuilder()
            .select('a.*')
            .from(tableName, 'a')
            .where('a.id = :empresaId', { empresaId })
            .orderBy('a.cdet', 'ASC')
            .getRawMany();
        res.json(articulos);
    }
    catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({
            message: 'Error al obtener los artículos',
            error: error instanceof Error ? error.message : 'Error'
        });
    }
};
exports.getArticulos = getArticulos;
/**
 * Obtiene un artículo por ID
 */
const getArticuloById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId)
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        const articulo = await database_1.AppDataSource.createQueryBuilder()
            .select('a.*')
            .from(tableName, 'a')
            .where('a.xxx = :id', { id: Number(id) })
            .andWhere('a.id = :empresaId', { empresaId })
            .getRawOne();
        if (!articulo)
            return res.status(404).json({ message: 'Artículo no encontrado' });
        res.json(articulo);
    }
    catch (error) {
        console.error('Error al obtener artículo:', error);
        res.status(500).json({
            message: 'Error al obtener el artículo',
            error: error instanceof Error ? error.message : 'Error'
        });
    }
};
exports.getArticuloById = getArticuloById;
