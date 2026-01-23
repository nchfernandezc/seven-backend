/**
 * Definición de Tipos Globales para Express
 * 
 * Este archivo extiende la interfaz 'Request' y 'User' de Express.
 */

import * as express from 'express';

declare global {
    namespace Express {
        interface User {
            empresaId: number;
            vendedorId?: string;
            id?: number;
            username?: string;
            detalle?: string;
            role?: string;
        }

        interface Request {
            user?: User;
        }
    }
}

export { };
