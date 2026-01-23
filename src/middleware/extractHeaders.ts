import { Request, Response, NextFunction } from 'express';

/**
 * Middleware 'extractHeaders'
 * Extrae los identificadores de empresa y vendedor de los encabezados HTTP.
 */
export const extractHeaders = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const rawEmpresaId = req.headers['id_apk'] || req.headers['x-company-id'];
    const rawVendedorId = req.headers['vendedor_apk'] || req.headers['x-salesperson-id'];

    if (rawEmpresaId) {
      const empresaId = Number(rawEmpresaId);

      if (!isNaN(empresaId)) {
        // Inicializar req.user si no existe para evitar el error de "undefined"
        if (!req.user) {
          req.user = {
            empresaId: 0 // Valor temporal que será sobrescrito
          };
        }

        req.user.empresaId = empresaId;
        req.user.vendedorId = rawVendedorId ? String(rawVendedorId) : undefined;
      }
    }

    next();
  } catch (error) {
    console.error('[Middleware] Error al extraer headers:', error);
    next();
  }
};