"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticulo = exports.updateArticulo = exports.createArticulo = exports.getArticuloById = exports.getArticulos = void 0;
const database_1 = require("../config/database");
const Articulo_1 = require("../entities/Articulo");
const tableName_1 = require("../utils/tableName");
const articuloRepository = database_1.AppDataSource.getRepository(Articulo_1.Articulo);
const mapRawToArticulo = (raw) => ({
    internalId: raw.xxx,
    id: raw.id,
    ccod: raw.ccod,
    cdet: raw.cdet,
    cuni: raw.cuni,
    cref: raw.cref,
    npre1: raw.npre1,
    npre2: raw.npre2,
    npre3: raw.npre3,
    ncan1: raw.ncan1,
    ides: raw.ides,
    marca: raw.cmar
});
/**
 * Obtiene todos los artículos de una empresa
 */
const getArticulos = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        // Use raw query to avoid Entity Metadata validation errors
        const rawArticulos = await database_1.AppDataSource.createQueryBuilder()
            .select('*')
            .from(tableName, 'articulo')
            .where('articulo.id = :empresaId', { empresaId }) // 'id' is the empresaId column
            .orderBy('articulo.cdet', 'ASC')
            .getRawMany();
        const articulos = rawArticulos.map(mapRawToArticulo);
        res.json(articulos);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener artículos:', error);
        res.status(500).json({ message: 'Error al obtener los artículos', error: errorMessage });
    }
};
exports.getArticulos = getArticulos;
/**
 * Obtiene un artículo por ID (internalId / xxx)
 */
const getArticuloById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        const rawArticulo = await database_1.AppDataSource.createQueryBuilder()
            .select('*')
            .from(tableName, 'articulo')
            .where('articulo.xxx = :id', { id: Number(id) }) // 'xxx' is the internalId column
            .andWhere('articulo.id = :empresaId', { empresaId })
            .getRawOne();
        if (!rawArticulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.json(mapRawToArticulo(rawArticulo));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al obtener artículo:', error);
        res.status(500).json({ message: 'Error al obtener el artículo', error: errorMessage });
    }
};
exports.getArticuloById = getArticuloById;
/**
 * Crea un nuevo artículo
 */
const createArticulo = async (req, res) => {
    try {
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        // Verificar código único por empresa
        // Verificar código único por empresa
        const existingArticulo = await database_1.AppDataSource.createQueryBuilder()
            .select('1')
            .from(tableName, 'articulo')
            .where('articulo.ccod = :codigo', { codigo: req.body.ccod })
            .andWhere('articulo.id = :empresaId', { empresaId })
            .getRawOne();
        if (existingArticulo) {
            return res.status(400).json({
                message: 'El código de artículo ya existe'
            });
        }
        // Prepare object manually since we can't use repo.create for dynamic table inserts easily
        // We rely on QueryBuilder insert
        // Filter body to only allow valid columns (DB column names)
        // Based on Articulo entity and mapRawToArticulo
        const allowedColumns = [
            'ccod', 'cdet', 'cuni', 'cref', 'npre1', 'npre2', 'npre3', 'ncan1', 'ides',
            'cmar', 'is_deleted', 'last_synced_at', 'device_id', 'dfec'
        ];
        const insertData = {};
        // Copy direct matches
        for (const key of allowedColumns) {
            if (req.body[key] !== undefined) {
                insertData[key] = req.body[key];
            }
        }
        // Map frontend aliases/camelCase to DB columns
        if (req.body.codigo && !insertData.ccod)
            insertData.ccod = req.body.codigo;
        if (req.body.descripcion && !insertData.cdet)
            insertData.cdet = req.body.descripcion;
        if (req.body.precio !== undefined && insertData.npre1 === undefined)
            insertData.npre1 = req.body.precio;
        if (req.body.stock !== undefined && insertData.ncan1 === undefined)
            insertData.ncan1 = req.body.stock;
        if (req.body.cantidad !== undefined && insertData.ncan1 === undefined)
            insertData.ncan1 = req.body.cantidad;
        if (req.body.marca && !insertData.cmar)
            insertData.cmar = req.body.marca;
        // CamelCase to SnakeCase helpers
        if (req.body.isDeleted !== undefined && insertData.is_deleted === undefined)
            insertData.is_deleted = req.body.isDeleted;
        if (req.body.lastSyncedAt !== undefined && insertData.last_synced_at === undefined)
            insertData.last_synced_at = req.body.lastSyncedAt;
        if (req.body.deviceId !== undefined && insertData.device_id === undefined)
            insertData.device_id = req.body.deviceId;
        if (req.body.fecha !== undefined && insertData.dfec === undefined)
            insertData.dfec = req.body.fecha;
        const insertResult = await articuloRepository.createQueryBuilder()
            .insert()
            .into(tableName)
            .values({
            ...insertData,
            id: empresaId
        })
            .execute();
        // Fetch the created item to return standard response
        const newId = insertResult.identifiers[0].internalId || insertResult.raw.insertId;
        const nuevoArticulo = await articuloRepository.createQueryBuilder('articulo')
            .from(tableName, 'articulo')
            .where('articulo.internalId = :id', { id: Number(newId) })
            .getOne();
        res.status(201).json(nuevoArticulo);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al crear artículo:', error);
        res.status(500).json({ message: 'Error al crear el artículo', error: errorMessage });
    }
};
exports.createArticulo = createArticulo;
/**
 * Actualiza un artículo existente
 */
const updateArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        const articulo = await database_1.AppDataSource.createQueryBuilder()
            .select('*')
            .from(tableName, 'articulo')
            .where('articulo.xxx = :id', { id: Number(id) })
            .andWhere('articulo.id = :empresaId', { empresaId })
            .getRawOne();
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        // Verificar código único si se está actualizando
        if (req.body.ccod && req.body.ccod !== articulo.ccod) {
            const existingArticulo = await database_1.AppDataSource.createQueryBuilder()
                .select('1')
                .from(tableName, 'articulo')
                .where('articulo.ccod = :codigo', { codigo: req.body.ccod })
                .andWhere('articulo.id = :empresaId', { empresaId })
                .getRawOne();
            if (existingArticulo) {
                return res.status(400).json({
                    message: 'El código de artículo ya existe'
                });
            }
        }
        // Filter body to only allow valid columns (DB column names)
        // Based on Articulo entity and mapRawToArticulo
        const allowedColumns = [
            'ccod', 'cdet', 'cuni', 'cref', 'npre1', 'npre2', 'npre3', 'ncan1', 'ides',
            'cmar', 'is_deleted', 'last_synced_at', 'device_id', 'dfec'
        ];
        console.log('[updateArticulo] Incoming body:', JSON.stringify(req.body, null, 2));
        // Remove fields that are not in the allowed list
        const updateData = {};
        for (const key of allowedColumns) {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        }
        // Map frontend aliases/camelCase to DB columns
        if (req.body.codigo && !updateData.ccod)
            updateData.ccod = req.body.codigo;
        if (req.body.descripcion && !updateData.cdet)
            updateData.cdet = req.body.descripcion;
        if (req.body.precio !== undefined && updateData.npre1 === undefined)
            updateData.npre1 = req.body.precio;
        if (req.body.stock !== undefined && updateData.ncan1 === undefined)
            updateData.ncan1 = req.body.stock;
        if (req.body.cantidad !== undefined && updateData.ncan1 === undefined)
            updateData.ncan1 = req.body.cantidad;
        if (req.body.marca && !updateData.cmar)
            updateData.cmar = req.body.marca;
        // CamelCase to SnakeCase helpers
        if (req.body.isDeleted !== undefined && updateData.is_deleted === undefined)
            updateData.is_deleted = req.body.isDeleted;
        if (req.body.lastSyncedAt !== undefined && updateData.last_synced_at === undefined)
            updateData.last_synced_at = req.body.lastSyncedAt;
        if (req.body.deviceId !== undefined && updateData.device_id === undefined)
            updateData.device_id = req.body.deviceId;
        if (req.body.fecha !== undefined && updateData.dfec === undefined)
            updateData.dfec = req.body.fecha;
        console.log('[updateArticulo] Filtered updateData:', JSON.stringify(updateData, null, 2));
        // Check if we have anything to update
        if (Object.keys(updateData).length === 0) {
            console.warn('[updateArticulo] No valid fields found to update');
            return res.status(400).json({ message: 'No valid fields to update' });
        }
        await articuloRepository.createQueryBuilder()
            .update(tableName) // Note: typeorm update takes entity class or table name
            .set(updateData)
            .where('xxx = :id', { id: Number(id) }) // 'xxx' is the actual DB column for internalId
            .andWhere('id = :empresaId', { empresaId }) // 'id' is DB column for empresaId
            .execute();
        const articuloActualizado = await database_1.AppDataSource.createQueryBuilder()
            .select('*')
            .from(tableName, 'articulo')
            .where('articulo.xxx = :id', { id: Number(id) })
            .getRawOne();
        res.json(articuloActualizado);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al actualizar artículo:', error);
        res.status(500).json({ message: 'Error al actualizar el artículo', error: errorMessage });
    }
};
exports.updateArticulo = updateArticulo;
/**
 * Elimina un artículo
 */
const deleteArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        if (!empresaId) {
            return res.status(403).json({ message: 'No se ha especificado la empresa' });
        }
        const tableName = (0, tableName_1.getTableName)(empresaId, 'articulo');
        const resultado = await articuloRepository.createQueryBuilder()
            .delete()
            .from(tableName)
            .where('xxx = :id', { id: Number(id) }) // Database column name 'xxx'
            .andWhere('id = :empresaId', { empresaId }) // Database column name 'id'
            .execute();
        if (resultado.affected === 0) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al eliminar artículo:', error);
        res.status(500).json({ message: 'Error al eliminar el artículo', error: errorMessage });
    }
};
exports.deleteArticulo = deleteArticulo;
