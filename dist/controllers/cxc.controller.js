"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResumenCxcsByCliente = exports.getCxcById = exports.getCxcs = void 0;
const database_1 = require("../config/database");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const tableName_1 = require("../utils/tableName");
const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
/**
 * Obtiene CXC filtrando por empresa y reglas de negocio
 */
const getCxcs = async (req, res) => {
    try {
        const { empresaId, vendedorId } = req.user || {};
        if (!empresaId)
            return res.status(403).json({ message: 'Empresa no identificada' });
        const { clienteId, fechaInicio, fechaFin } = req.query;
        const cxcTable = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        const query = cxcRepository.createQueryBuilder('cxc')
            .from(cxcTable, 'cxc')
            .leftJoinAndMapOne('cxc.cliente', clienteTable, 'c', 'cxc.ccli = c.ccod AND c.id = cxc.id')
            .where('cxc.id = :empresaId', { empresaId })
            .andWhere('cxc.ista = 0') // Pendiente
            .andWhere('cxc.nsal > 0') // Con saldo
            .andWhere("cxc.cdoc IN ('FAC', 'ENT')");
        if (vendedorId)
            query.andWhere('cxc.cven = :vendedorId', { vendedorId });
        if (clienteId)
            query.andWhere('cxc.ccli = :clienteId', { clienteId });
        if (fechaInicio && fechaFin) {
            query.andWhere('cxc.dfec BETWEEN :inicio AND :fin', { inicio: fechaInicio, fin: fechaFin });
        }
        const cxcs = await query.orderBy('cxc.dfec', 'DESC').getMany();
        res.json(cxcs);
    }
    catch (error) {
        console.error('[CXC] Error:', error);
        res.status(500).json({ message: 'Error al obtener las cuentas por cobrar' });
    }
};
exports.getCxcs = getCxcs;
const getCxcById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        const cxcTable = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const cxc = await cxcRepository.createQueryBuilder('cxc')
            .from(cxcTable, 'cxc')
            .where('cxc.xxx = :id AND cxc.id = :empresaId', { id, empresaId })
            .getOne();
        if (!cxc)
            return res.status(404).json({ message: 'Cuenta no encontrada' });
        res.json(cxc);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener la cuenta' });
    }
};
exports.getCxcById = getCxcById;
const getResumenCxcsByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const { empresaId } = req.user || {};
        const cxcTable = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const todas = await cxcRepository.createQueryBuilder('cxc')
            .from(cxcTable, 'cxc')
            .where('cxc.ccli = :clienteId AND cxc.id = :empresaId', { clienteId, empresaId })
            .getMany();
        const resumen = {
            pendientes: { cantidad: 0, total: 0 },
            pagadas: { cantidad: 0, total: 0 },
            totalGeneral: 0
        };
        todas.forEach(cxc => {
            const monto = Number(cxc.nsal);
            if (cxc.ista === 1) {
                resumen.pagadas.cantidad++;
                resumen.pagadas.total += monto;
            }
            else {
                resumen.pendientes.cantidad++;
                resumen.pendientes.total += monto;
            }
        });
        resumen.totalGeneral = resumen.pendientes.total + resumen.pagadas.total;
        res.json({ resumen, detalle: todas });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener resumen' });
    }
};
exports.getResumenCxcsByCliente = getResumenCxcsByCliente;
