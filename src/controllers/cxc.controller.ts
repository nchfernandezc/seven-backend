import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { getTableName } from '../utils/tableName';

/**
 * Obtiene CXC filtrando por empresa y reglas de negocio
 */
export const getCxcs = async (req: Request, res: Response) => {
  try {
    const { empresaId, vendedorId } = (req as any).user || {};
    if (!empresaId) return res.status(403).json({ message: 'Empresa no identificada' });

    const { clienteId, fechaInicio, fechaFin } = req.query;
    const cxcTable = getTableName(empresaId, 'cxcobrar');
    const clienteTable = getTableName(empresaId, 'cliente');

    const query = AppDataSource.createQueryBuilder()
      .select('cxc.*')
      .addSelect('c.cdet', 'cliente_nombre')
      .from(cxcTable, 'cxc')
      .leftJoin(clienteTable, 'c', 'cxc.ccli = c.ccod AND c.id = :empresaId', { empresaId })
      .where('cxc.id = :empresaId', { empresaId })
      .andWhere('cxc.ista = 0') // Pendiente
      .andWhere('cxc.nsal > 0') // Con saldo
      .andWhere("cxc.cdoc IN ('FAC', 'ENT')");

    if (vendedorId) query.andWhere('cxc.cven = :vendedorId', { vendedorId });
    if (clienteId) query.andWhere('cxc.ccli = :clienteId', { clienteId });
    if (fechaInicio && fechaFin) {
      query.andWhere('cxc.dfec BETWEEN :inicio AND :fin', { inicio: fechaInicio, fin: fechaFin });
    }

    const cxcs = await query.orderBy('cxc.dfec', 'DESC').getRawMany();

    // Mapeo opcional si el frontend requiere 'cliente' anidado
    const result = cxcs.map(row => ({
      ...row,
      cliente: { cnom: row.cliente_nombre }
    }));

    res.json(result);
  } catch (error) {
    console.error('[CXC] Get Error:', error);
    res.status(500).json({
      message: 'Error al obtener las cuentas por cobrar',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const getCxcById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = (req as any).user || {};
    const cxcTable = getTableName(empresaId, 'cxcobrar');

    const cxc = await AppDataSource.createQueryBuilder()
      .select('cxc.*')
      .from(cxcTable, 'cxc')
      .where('cxc.xxx = :id AND cxc.id = :empresaId', { id, empresaId })
      .getRawOne();

    if (!cxc) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.json(cxc);
  } catch (error) {
    console.error('[CXC] GetById Error:', error);
    res.status(500).json({ message: 'Error al obtener la cuenta' });
  }
};

export const getResumenCxcsByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const { empresaId } = (req as any).user || {};
    const cxcTable = getTableName(empresaId, 'cxcobrar');

    const todas = await AppDataSource.createQueryBuilder()
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
      } else {
        resumen.pendientes.cantidad++;
        resumen.pendientes.total += monto;
      }
    });

    resumen.totalGeneral = resumen.pendientes.total + resumen.pagadas.total;
    // Retornamos también el detalle si la app lo consume
    res.json({ resumen, detalle: todas });
  } catch (error) {
    console.error('[CXC] Resumen Error:', error);
    res.status(500).json({ message: 'Error al obtener resumen' });
  }
};