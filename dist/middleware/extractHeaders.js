"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractHeaders = void 0;
const extractHeaders = (req, res, next) => {
    try {
        const companyId = req.headers['x-company-id'];
        const salespersonId = req.headers['x-salesperson-id'];
        console.log('=== MIDDLEWARE: Headers recibidos ===');
        console.log('x-company-id:', companyId);
        console.log('x-salesperson-id:', salespersonId);
        if (companyId) {
            req.user = {
                empresaId: Number(companyId),
                vendedorId: salespersonId
            };
            console.log('req.user establecido:', req.user);
        }
        next();
    }
    catch (error) {
        console.error('Error en extractHeaders middleware:', error);
        next();
    }
};
exports.extractHeaders = extractHeaders;
