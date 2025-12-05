// Extensión de tipos de Express para toda la aplicación
declare global {
    namespace Express {
        interface User {
            id?: number;
            empresaId: number;
            vendedorId?: string;
        }
    }
}

export { };
