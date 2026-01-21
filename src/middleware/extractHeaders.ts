import { Request, Response, NextFunction } from 'express';

/**
 * Middleware 'extractHeaders'
 * Extrae los IDs de empresa y vendedor de los encabezados HTTP (x-company-id, x-salesperson-id).
 * Inyecta estos datos en req.user para su uso en los controladores.
 */
export const extractHeaders = (req: Request, res: Response, next: NextFunction) => {
  try {
    // User requested exclusive use of _apk headers
    const companyId = req.headers['id_apk'];
    const salespersonId = req.headers['vendedor_apk'];

    console.log('=== MIDDLEWARE: Headers recibidos ===');
    console.log('id_apk:', companyId);
    console.log('vendedor_apk:', salespersonId);

    if (companyId) {
      req.user = {
        empresaId: Number(companyId),
        vendedorId: salespersonId as string
      };
      console.log('req.user establecido:', req.user);
    }

    next();
  } catch (error) {
    console.error('Error en extractHeaders middleware:', error);
    next();
  }
};