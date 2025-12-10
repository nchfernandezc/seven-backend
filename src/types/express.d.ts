/**
 * Definición de Tipos Globales para Express
 * 
 * Este archivo extiende la interfaz 'User' del namespace 'Express'.
 * Permite que TypeScript reconozca las propiedades personalizadas que
 * agregamos al objeto 'req.user' en nuestros middlewares (como extractHeaders).
 * 
 * Uso:
 * - req.user.empresaId
 * - req.user.vendedorId
 */

declare global {
    namespace Express {
        // Extendemos la interfaz User que usa Passport-like o req.user por defecto
        interface User {
            id?: number;
            empresaId: number;
            vendedorId?: string;
            username?: string;
            email?: string;
            role?: string;
        }

        // Si necesitamos extender Request directamente
        interface Request {
            // user: User; // Express ya tiene esta propiedad tipada con la interfaz User de arriba
        }
    }
}

export { };
