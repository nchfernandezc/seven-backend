"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableName = void 0;
/**
 * Genera el nombre de la tabla dinámica basado en el ID de la empresa.
 * Ejemplo: empresaId 1, entityName 'articulo' -> '001_articulo'
 */
const getTableName = (empresaId, entityName) => {
    const prefix = String(empresaId).padStart(3, '0');
    // Mapeo de nombres de entidad a sufijos de tabla
    const suffixes = {
        'articulo': 'articulo',
        'cliente': 'cliente',
        'cxcobrar': 'cxc', // La entidad se llama Cxcobrar pero la tabla es 001_cxc
        'pedido': 'pedido',
        // Agrega otros mapeos si es necesario
    };
    const suffix = suffixes[entityName.toLowerCase()] || entityName.toLowerCase();
    return `${prefix}_${suffix}`;
};
exports.getTableName = getTableName;
