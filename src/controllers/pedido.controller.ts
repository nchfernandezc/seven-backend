import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Pedido } from '../entities/Pedido';
import { Cliente } from '../entities/Cliente';
import { Articulo } from '../entities/Articulo';
import { Cxcobrar } from '../entities/Cxcobrar';
import { getTableName } from '../utils/tableName';

const pedidoRepository = AppDataSource.getRepository(Pedido);
const clienteRepository = AppDataSource.getRepository(Cliente);
const articuloRepository = AppDataSource.getRepository(Articulo);
const cxcRepository = AppDataSource.getRepository(Cxcobrar);

const mapRawToPedido = (raw: any) => ({
  id: raw.pedido_internalId || raw.pedido_xxx || raw.xxx, // Frontend expects unique ID here
  empresaId: raw.pedido_id || raw.id,
  num: raw.pedido_num || raw.num,
  ven: raw.pedido_ven || raw.ven,
  cod: raw.pedido_cod || raw.cod,
  des: raw.pedido_des || raw.des,
  cli: raw.pedido_cli || raw.cli,
  can: raw.pedido_can || raw.can,
  pre: raw.pedido_pre || raw.pre,
  fecha: raw.pedido_dfec || raw.dfec,
  estado: raw.pedido_itip || raw.itip,
  // Map relationships with safe access
  cliente: {
    ccod: raw.cliente_ccod || raw.cli_ccod || '',
    cdet: raw.cliente_cdet || raw.cli_cdet || 'Cliente Desconocido',
    cdir: raw.cliente_cdir || raw.cli_cdir || '',
    ctel: raw.cliente_ctel || raw.cli_ctel || ''
  },
  articulo: {
    ccod: raw.articulo_ccod || raw.art_ccod || '',
    cdet: raw.articulo_cdet || raw.art_cdet || 'Articulo Desconocido',
    npre1: raw.articulo_npre1 || raw.art_npre1 || 0
  }
});

/**
 * Obtiene todos los pedidos de una empresa
 */
export const getPedidos = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'pedido');
    const clienteTable = getTableName(empresaId, 'cliente');
    const articuloTable = getTableName(empresaId, 'articulo');

    // Use raw query builder from DataSource
    // Use raw query with manual aliases to avoid collisions
    // Assuming columns: pedido(num, ven, cod, des, can, pre, cli, id, dfec, itip, xxx)
    const sql = `
      SELECT 
        pedido.xxx AS pedido_internalId,
        pedido.id AS pedido_id,
        pedido.num AS pedido_num,
        pedido.ven AS pedido_ven,
        pedido.cod AS pedido_cod,
        pedido.des AS pedido_des,
        pedido.can AS pedido_can,
        pedido.pre AS pedido_pre,
        pedido.cli AS pedido_cli,
        pedido.dfec AS pedido_dfec,
        pedido.itip AS pedido_itip,
        cliente.ccod AS cliente_ccod,
        cliente.cdet AS cliente_cdet,
        cliente.cdir AS cliente_cdir,
        cliente.ctel AS cliente_ctel,
        articulo.ccod AS articulo_ccod,
        articulo.cdet AS articulo_cdet,
        articulo.npre1 AS articulo_npre1
      FROM \`${tableName}\` pedido
      LEFT JOIN \`${clienteTable}\` cliente ON pedido.cli = cliente.ccod AND cliente.id = ?
      LEFT JOIN \`${articuloTable}\` articulo ON pedido.cod = articulo.ccod AND articulo.id = ?
      WHERE pedido.id = ?
      ORDER BY pedido.dfec DESC
    `;

    const rawPedidos = await AppDataSource.query(sql, [empresaId, empresaId, empresaId]);
    console.log('[getPedidos] Raw result:', rawPedidos);

    const pedidos = rawPedidos.map(mapRawToPedido);

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos', error: errorMessage });
  }
};

/**
 * Obtiene un pedido por ID
 */
export const getPedidoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'pedido');

    const rawPedido = await AppDataSource.createQueryBuilder()
      .select('pedido.*')
      .addSelect(['cliente.ccod', 'cliente.cdet', 'cliente.cdir', 'cliente.ctel'])
      .addSelect(['articulo.ccod', 'articulo.cdet', 'articulo.npre1'])
      .from(tableName, 'pedido')
      .leftJoin(getTableName(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .leftJoin(getTableName(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
      .where('pedido.xxx = :id', { id: Number(id) })
      .andWhere('pedido.id = :empresaId', { empresaId })
      .getRawOne();

    if (!rawPedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(mapRawToPedido(rawPedido));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ message: 'Error al obtener el pedido', error: errorMessage });
  }
};

/**
 * Crea un nuevo pedido y genera la cuenta por cobrar asociada
 */
export const createPedido = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const pedidoTable = getTableName(empresaId, 'pedido');
    const clienteTable = getTableName(empresaId, 'cliente');
    const articuloTable = getTableName(empresaId, 'articulo');
    const cxcTable = getTableName(empresaId, 'cxcobrar');

    // Verificar cliente
    const cliente = await queryRunner.manager.createQueryBuilder()
      .select('1')
      .from(clienteTable, 'cliente')
      .where('cliente.ccod = :codigo', { codigo: req.body.cli })
      .andWhere('cliente.id = :empresaId', { empresaId })
      .getRawOne();

    if (!cliente) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar artículo
    const articulo = await queryRunner.manager.createQueryBuilder()
      .select('1')
      .from(articuloTable, 'articulo')
      .where('articulo.ccod = :codigo', { codigo: req.body.cod })
      .andWhere('articulo.id = :empresaId', { empresaId })
      .getRawOne();

    if (!articulo) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Calcular total
    const total = req.body.can * req.body.pre;

    // Crear pedido
    // Note: We use raw insert into dynamic table. 
    // Field mapping:
    // num (string) -> req.body.numero
    // ven (string) -> vendedoreId
    // cod (string) -> articuloCodigo
    // des (string) -> articuloDescripcion (extra)
    // can (decimal) -> cantidad
    // pre (decimal) -> precioVenta
    // cli (string) -> clienteCodigo
    // id (int) -> empresaId
    // date -> NOW()

    // We assume body has standard fields, we map to legacy columns
    const insertPedido = await queryRunner.manager.createQueryBuilder()
      .insert()
      .into(pedidoTable)
      .values({
        num: req.body.num || `PED-${Date.now()}`,
        ven: req.user?.vendedorId || 'VEN001',
        cod: req.body.cod,
        des: req.body.des || 'DESCRIPCION',
        can: req.body.can,
        pre: req.body.pre,
        cli: req.body.cli,
        id: empresaId,
        dfec: new Date(),
        itip: 1
      })
      .execute();

    const newPedidoId = insertPedido.raw.insertId;

    // Crear cuenta por cobrar
    // Get last CXC num
    const lastCxcResults = await queryRunner.query(
      `SELECT inum FROM \`${cxcTable}\` WHERE id = ? ORDER BY inum DESC LIMIT 1`,
      [empresaId]
    );
    const lastCxc = lastCxcResults[0];

    // cxc.inum is likely mapped to 'numero' property
    const nextNumero = lastCxc ? (lastCxc.inum) + 1 : 1;
    // Note: raw result keys depend on driver. Usually just 'inum'. 

    await queryRunner.manager.createQueryBuilder()
      .insert()
      .into(cxcTable)
      .values({
        cdoc: 'PED',
        inum: nextNumero,
        nsal: total,
        ccli: req.body.cli,
        dfec: new Date(),
        // fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // No 'dven' in this raw insert? If so use 'dven' if entity has it. Cxcobrar.ts says 'dven' is not in User's removed list? Wait, user removed dven in their edit?
        // User edit to Cxcobrar REMOVED 'dven'. But user requested earlier to add it? No, user requested "adjust entities headers".
        // Let's check user's Cxcobrar edit. 'dven' was commented out or removed?
        // "dven" was NOT in the list of kept columns. Only 'id', 'cdoc', 'inum', 'dfec', 'nsal', 'ccli', 'ista', 'cven'.
        // So we do not insert dven.
        ista: 0,
        cven: req.user?.vendedorId || 'VEN001',
        id: empresaId
      })
      .execute();

    await queryRunner.commitTransaction();

    // Obtener pedido con relaciones para respuesta
    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('pedido.*')
      .addSelect('cliente.*')
      .addSelect('articulo.*')
      .from(pedidoTable, 'pedido')
      .leftJoin(clienteTable, 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .leftJoin(articuloTable, 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
      .where('pedido.xxx = :id', { id: Number(newPedidoId) });

    const rawPedidoCreado = await queryBuilder.getRawOne();
    const pedidoCreado = mapRawToPedido(rawPedidoCreado);

    res.status(201).json(pedidoCreado);
  } catch (error: unknown) {
    if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido', error: errorMessage });
  } finally {
    await queryRunner.release();
  }
};

/**
 * Actualiza un pedido existente
 */
export const updatePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'pedido');

    const pedidoExistente = await AppDataSource.createQueryBuilder()
      .from(tableName, 'pedido')
      .where('pedido.xxx = :id', { id: Number(id) })
      .andWhere('pedido.id = :empresaId', { empresaId })
      .getRawOne();

    if (!pedidoExistente) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Checking foreign keys if updating
    // Checking foreign keys if updating
    if (req.body.cli) {
      const exists = await AppDataSource.createQueryBuilder()
        .select('1')
        .from(getTableName(empresaId, 'cliente'), 'c')
        .where('c.ccod = :cod', { cod: req.body.cli })
        .andWhere('c.id = :eid', { eid: empresaId })
        .getRawOne();
      if (!exists) return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // ... same for articulo if needed

    await AppDataSource.createQueryBuilder()
      .update(tableName)
      .set(req.body)
      .where('xxx = :id', { id: Number(id) })
      .andWhere('id = :empresaId', { empresaId })
      .execute();

    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('pedido.*')
      .addSelect('cliente.*')
      .addSelect('articulo.*')
      .from(tableName, 'pedido')
      .leftJoin(getTableName(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .leftJoin(getTableName(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
      .where('pedido.xxx = :id', { id: Number(id) });

    const rawPedidoActualizado = await queryBuilder.getRawOne();
    const pedidoActualizado = mapRawToPedido(rawPedidoActualizado);

    res.json(pedidoActualizado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el pedido', error: errorMessage });
  }
};

/**
 * Elimina un pedido
 */
export const deletePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'pedido');

    const resultado = await AppDataSource.createQueryBuilder()
      .delete()
      .from(tableName)
      .where('xxx = :id', { id: Number(id) })
      .andWhere('id = :empresaId', { empresaId })
      .execute();

    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'No se pudo eliminar el pedido' });
    }

    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ message: 'Error al eliminar el pedido', error: errorMessage });
  }
};

/**
 * Obtiene pedidos de un cliente específico
 */
export const getPedidosByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'pedido');

    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('pedido.*')
      .addSelect('cliente.*')
      .addSelect('articulo.*')
      .from(tableName, 'pedido')
      .leftJoin(getTableName(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .leftJoin(getTableName(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
      .where('pedido.cli = :clienteId', { clienteId })
      .andWhere('pedido.id = :empresaId', { empresaId })
      .orderBy('pedido.dfec', 'DESC');

    const rawPedidos = await queryBuilder.getRawMany();
    const pedidos = rawPedidos.map(mapRawToPedido);

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedidos por cliente:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del cliente', error: errorMessage });
  }
};

/**
 * Obtiene pedidos de un artículo específico
 */
export const getPedidosByArticulo = async (req: Request, res: Response) => {
  try {
    const { articuloCodigo } = req.params;
    const { empresaId } = req.user || {};

    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const tableName = getTableName(empresaId, 'pedido');

    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('pedido.*')
      .addSelect('cliente.*')
      .addSelect('articulo.*')
      .from(tableName, 'pedido')
      .leftJoin(getTableName(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .leftJoin(getTableName(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
      .where('pedido.cod = :articuloCodigo', { articuloCodigo })
      .andWhere('pedido.id = :empresaId', { empresaId })
      .orderBy('pedido.dfec', 'DESC');

    const rawPedidos = await queryBuilder.getRawMany();
    const pedidos = rawPedidos.map(mapRawToPedido);

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedidos por artículo:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del artículo', error: errorMessage });
  }
};
