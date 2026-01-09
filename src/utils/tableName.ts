/**
 * Genera el nombre de la tabla dinámica basado en el ID de la empresa.
 * Ejemplo: empresaId 1, entityName 'articulo' -> '001_articulo'
 */
export const getTableName = (empresaId: number, entityName: string): string => {
    const prefix = String(empresaId).padStart(3, '0');
    // Mapeo de nombres de entidad a sufijos de tabla
    const suffixes: { [key: string]: string } = {
        'articulo': 'articulo',
        'cliente': 'cliente',
        'cxcobrar': 'cxc', // La entidad se llama Cxcobrar pero la tabla es 001_cxc
        'pedido': 'pedido',
        // Agrega otros mapeos si es necesario
    };

    const suffix = suffixes[entityName.toLowerCase()] || entityName.toLowerCase();
    return `${prefix}_${suffix}`;
};
