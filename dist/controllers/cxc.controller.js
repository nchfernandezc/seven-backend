"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResumenCxcsByCliente = exports.getCxcById = exports.getCxcs = void 0;
const database_1 = require("../config/database");
const tableName_1 = require("../utils/tableName");
/**
 * Obtiene CXC filtrando por empresa y reglas de negocio
 */
const getCxcs = async (req, res) => {
    try {
        const { empresaId, vendedorId } = req.user || {};
        console.log('[CXC DEBUG] User context:', { empresaId, vendedorId });
        if (!empresaId) {
            console.error('[CXC ERROR] No empresaId found in request user');
            return res.status(403).json({ message: 'Empresa no identificada' });
        }
        const { clienteId, fechaInicio, fechaFin } = req.query;
        const cxcTable = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const clienteTable = (0, tableName_1.getTableName)(empresaId, 'cliente');
        console.log('[CXC DEBUG] Tables:', { cxcTable, clienteTable });
        console.log('[CXC DEBUG] Query params:', { clienteId, fechaInicio, fechaFin });
        let sql = `
      SELECT cxc.*, c.cdet as cliente_nombre
      FROM \`${cxcTable}\` cxc
      LEFT JOIN \`${clienteTable}\` c ON cxc.ccli = c.ccod AND c.id = cxc.id
      WHERE cxc.id = ? AND cxc.ista = 0 AND cxc.nsal != 0
    `;
        const params = [empresaId];
        if (vendedorId && vendedorId !== '0' && vendedorId !== '00') {
            sql += ' AND (cxc.cven = ? OR cxc.cven = 0 OR cxc.cven = "" OR cxc.cven = "00")';
            params.push(vendedorId);
        }
        if (clienteId) {
            sql += ' AND cxc.ccli = ?';
            params.push(clienteId);
        }
        if (fechaInicio && fechaFin) {
            sql += ' AND cxc.dfec BETWEEN ? AND ?';
            params.push(fechaInicio, fechaFin);
        }
        sql += ' ORDER BY cxc.dfec DESC';
        console.log('[CXC DEBUG] SQL:', sql);
        console.log('[CXC DEBUG] Params:', params);
        const cxcs = await database_1.AppDataSource.query(sql, params);
        console.log('[CXC DEBUG] Found records:', cxcs.length);
        const result = cxcs.map((row) => ({
            ...row,
            cliente: { cnom: row.cliente_nombre }
        }));
        res.json(result);
    }
    catch (error) {
        console.error('[CXC] Get Error:', error);
        res.status(500).json({
            message: 'Error al obtener las cuentas por cobrar',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.getCxcs = getCxcs;
const getCxcById = async (req, res) => {
    try {
        const { id } = req.params;
        const { empresaId } = req.user || {};
        const cxcTable = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const cxc = await database_1.AppDataSource.createQueryBuilder()
            .select('cxc.*')
            .from(cxcTable, 'cxc')
            .where('cxc.xxx = :id AND cxc.id = :empresaId', { id, empresaId })
            .getRawOne();
        if (!cxc)
            return res.status(404).json({ message: 'Cuenta no encontrada' });
        res.json(cxc);
    }
    catch (error) {
        console.error('[CXC] GetById Error:', error);
        res.status(500).json({ message: 'Error al obtener la cuenta' });
    }
};
exports.getCxcById = getCxcById;
const getResumenCxcsByCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        const { empresaId } = req.user || {};
        const cxcTable = (0, tableName_1.getTableName)(empresaId, 'cxcobrar');
        const todas = await database_1.AppDataSource.createQueryBuilder()
            .select('cxc.*')
            .from(cxcTable, 'cxc')
            .where('cxc.ccli = :clienteId AND cxc.id = :empresaId', { clienteId, empresaId })
            .getRawMany();
        const resumen = {
            pendientes: { cantidad: 0, total: 0 },
            pagadas: { cantidad: 0, total: 0 },
            totalGeneral: 0
        };
        todas.forEach(cxc => {
            const monto = Number(cxc.nsal);
            // Validamos ista, asumiendo 1 = pagado, 0 = pendiente
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
        // Retornamos también el detalle si la app lo consume
        res.json({ resumen, detalle: todas });
    }
    catch (error) {
        console.error('[CXC] Resumen Error:', error);
        res.status(500).json({ message: 'Error al obtener resumen' });
    }
};
exports.getResumenCxcsByCliente = getResumenCxcsByCliente;
