"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarVendedor = void 0;
const database_1 = require("../config/database");
const Vendedor_1 = require("../entities/Vendedor");
const vendedorRepository = database_1.AppDataSource.getRepository(Vendedor_1.Vendedor);
const validarVendedor = async (req, res) => {
    try {
        const { empresaId, numeroVendedor } = req.params;
        const vendedor = await vendedorRepository.findOne({
            where: {
                codigo: numeroVendedor,
                empresa: { id: parseInt(empresaId) }
            },
            relations: ['empresa']
        });
        if (!vendedor) {
            return res.status(404).json({
                success: false,
                message: 'Vendedor no encontrado o no pertenece a la empresa'
            });
        }
        res.json({
            success: true,
            data: {
                id: vendedor.id,
                codigo: vendedor.codigo,
                nombre: vendedor.nombre,
                telefono: vendedor.telefono,
                empresa: {
                    id: vendedor.empresa.id,
                    nombre: vendedor.empresa.nombre
                }
            }
        });
    }
    catch (error) {
        console.error('Error al validar vendedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al validar el vendedor'
        });
    }
};
exports.validarVendedor = validarVendedor;
