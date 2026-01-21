import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cxcobrar, EstadoCxc } from '../entities/Cxcobrar';
import { Cliente } from '../entities/Cliente';
import { getTableName } from '../utils/tableName';

const cxcRepository = AppDataSource.getRepository(Cxcobrar);
const clienteRepository = AppDataSource.getRepository(Cliente);

interface CxcFilter {
  fechaInicio?: string;
  fechaFin?: string;
  estado?: EstadoCxc;
  clienteId?: string;
  empresaId?: number;
  vendedorId?: string;
}

const mapRawToCxc = (raw: any) => ({
  internalId: raw.cxc_xxx || raw.xxx,
  id: raw.cxc_id || raw.id,
  cdoc: raw.cxc_cdoc || raw.cdoc,
  ccli: raw.cxc_ccli || raw.ccli,
  inum: raw.cxc_inum || raw.inum,
  monto: Number(raw.cxc_impo || raw.impo || (Number(raw.cxc_nnet || raw.nnet || 0) + Number(raw.cxc_niva || raw.niva || 0))),
  nnet: raw.cxc_nnet || raw.nnet,
  niva: raw.cxc_niva || raw.niva,
  dfec: raw.cxc_dfec || raw.dfec,
  nsal: raw.cxc_nsal || raw.nsal,
  dias: raw.cxc_idia || raw.idia,
  estatus: (raw.cxc_ista === 1 || raw.ista === 1) ? 'pagado' : 'pendiente',
  // Map joined client data if available
  // Check for 'ccod' (legacy) aliases
  cliente: (raw.cliente_codigo || raw.cliente_ccod) ? {
    internalId: raw.cliente_xxx,
    ccod: raw.cliente_codigo || raw.cliente_ccod,
    cdet: raw.cliente_nombre || raw.cliente_cnom || raw.cliente_nom || raw.cliente_cdet,
    cdir: raw.cliente_direccion || raw.cliente_cdir || raw.cliente_dir,
    ctel: raw.cliente_telefono || raw.cliente_ctel || raw.cliente_tel,
    cven: raw.cliente_vendedorCodigo || raw.cliente_cven
  } : undefined
});

/**
 * Obtiene todas las cuentas por cobrar con filtros opcionales
 */
export const getCxcs = async (req: Request, res: Response) => {
  try {
    const filter: CxcFilter = req.query;
    // Prefer req.user.empresaId if available (secure), otherwise query param if allowed
    const empresaId = req.user?.empresaId || (filter.empresaId ? Number(filter.empresaId) : undefined);

    if (!empresaId) {
      return res.status(400).json({ message: 'Se requiere el ID de la empresa' });
    }

    const tableName = getTableName(empresaId, 'cxcobrar');
    const clienteTable = getTableName(empresaId, 'cliente');

    // Use raw query builder from DataSource
    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('cxc.*')
      .addSelect('cliente.*')
      .from(tableName, 'cxc')
      .leftJoin(clienteTable, 'cliente', 'cxc.ccli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .where('cxc.id = :empresaId', { empresaId })
      .orderBy('cxc.dfec', 'DESC');

    // --- STRICT USER RULES START ---
    // Rule: ista=0 (Pendiente)
    queryBuilder.andWhere('cxc.ista = 0');

    // Rule: nsal > 0
    queryBuilder.andWhere('cxc.nsal > 0');

    // Rule: cdoc in ('FAC', 'ENT')
    queryBuilder.andWhere("cxc.cdoc IN ('FAC', 'ENT')");

    const vendedorId = req.user?.vendedorId || filter.vendedorId;
    if (vendedorId) {
      // Rule: cven = vendedor_apk
      // Note: User said cven=vendedor_apk in the 999_cxc context.
      // Cxcobrar entity has 'cven'.
      queryBuilder.andWhere('cxc.cven = :vendedorId', { vendedorId });
    }
    // --- STRICT USER RULES END ---

    // Optional additional filters (if they don't conflict, though user rules imply a strict view)
    if (filter.fechaInicio && filter.fechaFin) {
      queryBuilder.andWhere('cxc.dfec BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: new Date(filter.fechaInicio),
        fechaFin: new Date(filter.fechaFin)
      });
    } else if (filter.fechaInicio) {
      queryBuilder.andWhere('cxc.dfec >= :fechaInicio', {
        fechaInicio: new Date(filter.fechaInicio)
      });
    } else if (filter.fechaFin) {
      queryBuilder.andWhere('cxc.dfec <= :fechaFin', {
        fechaFin: new Date(filter.fechaFin)
      });
    }

    if (filter.clienteId) {
      queryBuilder.andWhere('cxc.ccli = :clienteId', { clienteId: filter.clienteId });
    }

    const rawCxcs = await queryBuilder.getRawMany();

    // Map raw results due to join aliases
    // getRawMany with alias returns cxc_column, cliente_column
    // We update mapper to handle this
    const cxcs = rawCxcs.map(raw => mapRawToCxc({
      ...raw,
      // Manual helpers for the mapper which expects specific structure or prefixes
      // Raw returns `cxc_xxx`, `cliente_nombre`, etc.
      // We ensure mapper handles them.
    }));

    res.json(cxcs);
  } catch (error) {
    console.error('Error al obtener cuentas por cobrar:', error);
    res.status(500).json({
      message: 'Error al obtener las cuentas por cobrar',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtiene una cuenta por cobrar por ID
 */
export const getCxcById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'cxcobrar');

    // Use Raw Query
    const rawCxc = await AppDataSource.createQueryBuilder()
      .select('cxc.*')
      .addSelect('cliente.*')
      .from(tableName, 'cxc')
      .leftJoin(getTableName(empresaId, 'cliente'), 'cliente', 'cxc.ccli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .where('cxc.xxx = :id', { id: Number(id) })
      .andWhere('cxc.id = :empresaId', { empresaId })
      .getRawOne();

    if (!rawCxc) {
      return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
    }

    res.json(mapRawToCxc(rawCxc));
  } catch (error) {
    console.error('Error al obtener cuenta por cobrar:', error);
    res.status(500).json({
      message: 'Error al obtener la cuenta por cobrar',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Crea una nueva cuenta por cobrar
 */
export const createCxc = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    const { monto, clienteCodigo, empresaId } = req.body;

    const finalEmpresaId = req.user?.empresaId || empresaId;

    if (!monto || monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser mayor a cero' });
    }

    if (!clienteCodigo) {
      return res.status(400).json({ message: 'El código de cliente es requerido' });
    }

    if (!finalEmpresaId) {
      return res.status(400).json({ message: 'El ID de empresa es requerido' });
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const clienteTable = getTableName(finalEmpresaId, 'cliente');
    const cxcTable = getTableName(finalEmpresaId, 'cxcobrar');

    // Verificar cliente
    const cliente = await queryRunner.manager.createQueryBuilder()
      .select('cliente')
      .from(clienteTable, 'cliente')
      .where('cliente.ccod = :codigo', { codigo: clienteCodigo })
      .andWhere('cliente.id = :empresaId', { empresaId: finalEmpresaId })
      .getRawOne();

    if (!cliente) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Insertar
    const insertResult = await queryRunner.manager.createQueryBuilder()
      .insert()
      .into(cxcTable)
      .values({
        ...req.body,
        fecha: new Date(),
        estado: 'pendiente',
        saldo: monto,
        empresaId: finalEmpresaId
      })
      .execute();

    await queryRunner.commitTransaction();

    const newId = insertResult.identifiers[0].internalId || insertResult.raw.insertId;

    const cxcConRelaciones = await cxcRepository.createQueryBuilder('cxc')
      .from(cxcTable, 'cxc')
      .leftJoinAndMapOne('cxc.cliente', clienteTable, 'cliente', 'cxc.ccli = cliente.ccod AND cliente.id = :empresaId', { empresaId: finalEmpresaId })
      .where('cxc.internalId = :id', { id: Number(newId) })
      .getOne();

    res.status(201).json(cxcConRelaciones);
  } catch (error) {
    if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
    console.error('Error al crear cuenta por cobrar:', error);
    res.status(500).json({
      message: 'Error al crear la cuenta por cobrar',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    await queryRunner.release();
  }
};

/**
 * Actualiza una cuenta por cobrar existente
 */
export const updateCxc = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'cxcobrar');

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const cxc = await cxcRepository.createQueryBuilder('cxc')
      .from(tableName, 'cxc')
      .where('cxc.internalId = :id', { id: Number(id) })
      .andWhere('cxc.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!cxc) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
    }

    const { id: _, clienteCodigo, fecha, empresaId: __, ...updateData } = req.body;

    // Si se marca como pagado
    if (updateData.estado === 'pagado') {
      updateData.saldo = 0;
    }

    await queryRunner.manager.createQueryBuilder()
      .update(tableName)
      .set({
        ...updateData,
        // We must transform 'pagado' -> 1 if we are using raw update, 
        // because transformers only work on Entity save/find.
        estado: updateData.estado === 'pagado' ? 1 : 0
      })
      .where('xxx = :id', { id: Number(id) })
      .execute();

    await queryRunner.commitTransaction();

    const cxcActualizado = await cxcRepository.createQueryBuilder('cxc')
      .from(tableName, 'cxc')
      .leftJoinAndMapOne('cxc.cliente', getTableName(empresaId, 'cliente'), 'cliente', 'cxc.ccli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .where('cxc.internalId = :id', { id: Number(id) })
      .getOne();

    res.json(cxcActualizado);
  } catch (error) {
    if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
    console.error('Error al actualizar cuenta por cobrar:', error);
    res.status(500).json({
      message: 'Error al actualizar la cuenta por cobrar',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    await queryRunner.release();
  }
};

/**
 * Elimina una cuenta por cobrar
 */
export const deleteCxc = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'cxcobrar');

    await queryRunner.connect();
    // Assuming delete is atomic enough or we need to check constraints, transaction is good practice
    await queryRunner.startTransaction();

    const cxc = await cxcRepository.createQueryBuilder('cxc')
      .from(tableName, 'cxc')
      .where('cxc.internalId = :id', { id: Number(id) })
      .andWhere('cxc.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!cxc) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
    }

    if (cxc.estado === 'pagado') {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        message: 'No se puede eliminar una cuenta pagada'
      });
    }

    const result = await queryRunner.manager.createQueryBuilder()
      .delete()
      .from(tableName)
      .where('xxx = :id', { id: Number(id) })
      .execute();

    if (result.affected === 0) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: 'No se pudo eliminar la cuenta' });
    }

    await queryRunner.commitTransaction();
    res.status(204).send();
  } catch (error) {
    if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
    console.error('Error al eliminar cuenta por cobrar:', error);
    res.status(500).json({
      message: 'Error al eliminar la cuenta por cobrar',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    await queryRunner.release();
  }
};

/**
 * Obtiene cuentas por cobrar de un cliente específico
 */
export const getCxcsByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const filter: CxcFilter = req.query;
    const empresaId = req.user?.empresaId || (filter.empresaId ? Number(filter.empresaId) : undefined);

    if (!empresaId) {
      return res.status(400).json({ message: 'Se requiere el ID de la empresa' });
    }

    const tableName = getTableName(empresaId, 'cxcobrar');
    const clienteTable = getTableName(empresaId, 'cliente');

    const queryBuilder = cxcRepository.createQueryBuilder('cxc')
      .from(tableName, 'cxc')
      .leftJoinAndMapOne('cxc.cliente', clienteTable, 'cliente', 'cxc.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
      .where('cxc.ccli = :clienteId', { clienteId })
      .andWhere('cxc.id = :empresaId', { empresaId })
      .orderBy('cxc.dfec', 'DESC');

    if (filter.estado) {
      queryBuilder.andWhere('cxc.estado = :estado', { estado: filter.estado });
    }

    if (filter.fechaInicio && filter.fechaFin) {
      queryBuilder.andWhere('cxc.fecha BETWEEN :fi AND :ff', {
        fi: new Date(filter.fechaInicio),
        ff: new Date(filter.fechaFin)
      });
    }

    const cxcs = await queryBuilder.getMany();
    res.json(cxcs);
  } catch (error) {
    console.error('Error al obtener cuentas del cliente:', error);
    res.status(500).json({
      message: 'Error al obtener las cuentas del cliente',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtiene resumen de cuentas por cobrar de un cliente
 */
export const getResumenCxcsByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const { empresaId: queryEmpresaId } = req.query;
    const empresaId = req.user?.empresaId || (queryEmpresaId ? Number(queryEmpresaId) : undefined);

    if (!empresaId) {
      return res.status(403).json({ message: 'Empresa ID requerido' });
    }

    const cxcTable = getTableName(empresaId, 'cxcobrar');

    const baseQuery = cxcRepository.createQueryBuilder('cxc')
      .from(cxcTable, 'cxc')
      .where('cxc.ccli = :clienteId', { clienteId })
      .andWhere('cxc.id = :empresaId', { empresaId });

    // Clonamos queries para distintos estados
    const qPendientes = baseQuery.clone().andWhere("cxc.ista = 0 AND cxc.dven > NOW()");
    const qVencidas = baseQuery.clone().andWhere("cxc.ista = 0 AND cxc.dven <= NOW()");
    const qPagadas = baseQuery.clone().andWhere("cxc.ista = 1");

    const [pendientes, vencidas, pagadas] = await Promise.all([
      qPendientes.getMany(),
      qVencidas.getMany(),
      qPagadas.getMany()
    ]);

    const totalPendiente = pendientes.reduce((sum, cxc) => sum + Number(cxc.nsal), 0);
    const totalVencido = vencidas.reduce((sum, cxc) => sum + Number(cxc.nsal), 0);
    const totalPagado = pagadas.reduce((sum, cxc) => sum + Number(cxc.nsal), 0);

    res.json({
      resumen: {
        pendientes: { cantidad: pendientes.length, total: totalPendiente },
        vencidas: { cantidad: vencidas.length, total: totalVencido },
        pagadas: { cantidad: pagadas.length, total: totalPagado },
        totalGeneral: totalPendiente + totalVencido + totalPagado
      },
      detalle: { pendientes, vencidas, pagadas }
    });
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({
      message: 'Error al obtener el resumen',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtiene cuentas vencidas
 */
export const getCxcsVencidas = async (req: Request, res: Response) => {
  try {
    const { empresaId: queryEmpresaId } = req.query;
    const empresaId = req.user?.empresaId || (queryEmpresaId ? Number(queryEmpresaId) : undefined);

    if (!empresaId) return res.status(400).json({ message: 'Empresa ID requerido' });

    const table = getTableName(empresaId, 'cxcobrar');
    const cxcs = await cxcRepository.createQueryBuilder('cxc')
      .from(table, 'cxc')
      .leftJoinAndMapOne('cxc.cliente', getTableName(empresaId, 'cliente'), 'cliente', 'cxc.ccli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .where('cxc.ista = 0')
      .andWhere('cxc.dven < NOW()')
      .andWhere('cxc.id = :empresaId', { empresaId })
      .orderBy('cxc.dven', 'ASC')
      .getMany();

    res.json(cxcs);
  } catch (error) {
    console.error('Error al obtener cuentas vencidas:', error);
    res.status(500).json({ message: 'Error', error: error instanceof Error ? error.message : 'Error desconocido' });
  }
};

/**
 * Obtiene cuentas próximas a vencer
 */
export const getCxcsPorVencer = async (req: Request, res: Response) => {
  try {
    const { dias = 7, empresaId: queryEmpresaId } = req.query as any;
    const empresaId = req.user?.empresaId || (queryEmpresaId ? Number(queryEmpresaId) : undefined);

    if (!empresaId) return res.status(400).json({ message: 'Empresa ID requerido' });

    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + Number(dias));

    const table = getTableName(empresaId, 'cxcobrar');

    const cxcs = await cxcRepository.createQueryBuilder('cxc')
      .from(table, 'cxc')
      .leftJoinAndMapOne('cxc.cliente', getTableName(empresaId, 'cliente'), 'cliente', 'cxc.ccli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .where('cxc.ista = 0')
      .andWhere('cxc.dven BETWEEN :hoy AND :limite', { hoy, limite: fechaLimite })
      .andWhere('cxc.id = :empresaId', { empresaId })
      .orderBy('cxc.dven', 'ASC')
      .getMany();

    res.json(cxcs);
  } catch (error) {
    console.error('Error al obtener cuentas por vencer:', error);
    res.status(500).json({ message: 'Error', error: error instanceof Error ? error.message : 'Error desconocido' });
  }
};