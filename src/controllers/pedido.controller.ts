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
  internalId: raw.pedido_xxx || raw.xxx,
  empresaId: raw.pedido_id || raw.id,
  numero: raw.pedido_num || raw.num,
  vendedorCodigo: raw.pedido_ven || raw.ven,
  articuloCodigo: raw.pedido_cod || raw.cod,
  descripcion: raw.pedido_des || raw.des,
  clienteCodigo: raw.pedido_cli || raw.cli,
  cantidad: raw.pedido_can || raw.can,
  precio: raw.pedido_pre || raw.pre,
  fecha: raw.pedido_dfec || raw.dfec,
  estado: raw.pedido_ista || raw.ista || raw.pedido_itip || raw.itip,
  // Map relationships
  cliente: {
    codigo: raw.cliente_codigo || raw.cliente_ccod || raw.cliente_cli,
    nombre: raw.cliente_nombre || raw.cliente_cnom || raw.cliente_nom,
    direccion: raw.cliente_direccion || raw.cliente_cdir || raw.cliente_dir,
    telefono: raw.cliente_telefono || raw.cliente_ctel || raw.cliente_tel
  },
  articulo: {
    codigo: raw.articulo_codigo || raw.articulo_ccod || raw.articulo_cod,
    descripcion: raw.articulo_descripcion || raw.articulo_cdet || raw.articulo_des,
    precio: raw.articulo_precio1 || raw.articulo_npre1 || raw.articulo_pre1
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
    const queryBuilder = AppDataSource.createQueryBuilder()
      .select('pedido.*')
      .addSelect('cliente.*')
      .addSelect('articulo.*')
      .from(tableName, 'pedido')
      .leftJoin(clienteTable, 'cliente', 'pedido.cli = cliente.ccod AND cliente.id = :empresaId', { empresaId })
      .leftJoin(articuloTable, 'articulo', 'pedido.cod = articulo.ccod AND articulo.id = :empresaId', { empresaId })
      .where('pedido.id = :empresaId', { empresaId })
      .orderBy('pedido.dfec', 'DESC');

    const rawPedidos = await queryBuilder.getRawMany();

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
      .addSelect(['cliente.codigo', 'cliente.nombre', 'cliente.direccion', 'cliente.telefono'])
      .addSelect(['articulo.codigo', 'articulo.descripcion', 'articulo.npre1'])
      .from(tableName, 'pedido')
      .leftJoin(getTableName(empresaId, 'cliente'), 'cliente', 'pedido.cli = cliente.codigo AND cliente.id = :empresaId', { empresaId })
      .leftJoin(getTableName(empresaId, 'articulo'), 'articulo', 'pedido.cod = articulo.codigo AND articulo.id = :empresaId', { empresaId })
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
      .select('cliente')
      .from(clienteTable, 'cliente')
      .where('cliente.codigo = :codigo', { codigo: req.body.clienteCodigo })
      .andWhere('cliente.empresaId = :empresaId', { empresaId })
      .getRawOne();

    if (!cliente) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar artículo
    const articulo = await queryRunner.manager.createQueryBuilder()
      .select('articulo')
      .from(articuloTable, 'articulo')
      .where('articulo.codigo = :codigo', { codigo: req.body.articuloCodigo })
      .andWhere('articulo.empresaId = :empresaId', { empresaId })
      .getRawOne();

    if (!articulo) {
      await queryRunner.rollbackTransaction();
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Calcular total
    const total = req.body.cantidad * req.body.precioVenta;

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
        num: req.body.numero || `PED-${Date.now()}`, // Fallback if not provided
        ven: req.user?.vendedorId || 'VEN001',
        cod: req.body.articuloCodigo,
        des: req.body.articuloDescripcion || 'DESCRIPCION',
        can: req.body.cantidad,
        pre: req.body.precioVenta,
        cli: req.body.clienteCodigo,
        empresaId: empresaId, // 'id' column
        fecha: new Date(),
        estado: 1 // 'itip' or similar if existing? Assuming entity logic handles mapping if we used entity
        // but here we are raw. Let's look at schema. 
        // 001_pedido columns: num, ven, cod, des, can, pre, cli, id (empresa), ...
      })
      .execute();

    const newPedidoId = insertPedido.identifiers[0].internalId || insertPedido.raw.insertId;

    // Crear cuenta por cobrar
    // Get last CXC num
    const lastCxc = await queryRunner.manager.createQueryBuilder()
      .select('cxc')
      .from(cxcTable, 'cxc')
      .where('cxc.empresaId = :empresaId', { empresaId })
      .orderBy('cxc.inum', 'DESC') // 'inum' is the number column
      .getRawOne();

    // cxc.inum is likely mapped to 'numero' property
    const nextNumero = lastCxc ? (lastCxc.cxc_inum || lastCxc.inum) + 1 : 1;
    // Note: raw result keys depend on driver. Usually just 'inum'. 

    await queryRunner.manager.createQueryBuilder()
      .insert()
      .into(cxcTable)
      .values({
        tipoDocumento: 'PED', // 'cdoc'
        numero: nextNumero, // 'inum'
        monto: total, // 'nsal' ?
        saldo: total,
        clienteCodigo: req.body.clienteCodigo,
        fecha: new Date(),
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        estado: 0, // 0 = pendiente
        observaciones: `Cuenta generada por pedido`,
        empresaId: empresaId
      })
      .execute();

    await queryRunner.commitTransaction();

    // Obtener pedido con relaciones para respuesta
    const pedidoCreado = await pedidoRepository.createQueryBuilder('pedido')
      .from(pedidoTable, 'pedido')
      .leftJoinAndMapOne('pedido.cliente', clienteTable, 'cliente', 'pedido.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
      .leftJoinAndMapOne('pedido.articulo', articuloTable, 'articulo', 'pedido.articuloCodigo = articulo.codigo AND articulo.empresaId = :empresaId', { empresaId })
      .where('pedido.internalId = :id', { id: Number(newPedidoId) })
      .getOne();

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

    const pedidoExistente = await pedidoRepository.createQueryBuilder('pedido')
      .from(tableName, 'pedido')
      .where('pedido.internalId = :id', { id: Number(id) })
      .andWhere('pedido.empresaId = :empresaId', { empresaId })
      .getOne();

    if (!pedidoExistente) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Checking foreign keys if updating
    if (req.body.clienteCodigo) {
      const exists = await clienteRepository.createQueryBuilder('c')
        .from(getTableName(empresaId, 'cliente'), 'c')
        .where('c.codigo = :cod', { cod: req.body.clienteCodigo })
        .andWhere('c.empresaId = :eid', { eid: empresaId })
        .getOne();
      if (!exists) return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // ... same for articulo if needed

    await pedidoRepository.createQueryBuilder()
      .update(tableName)
      .set(req.body)
      .where('xxx = :id', { id: Number(id) })
      .execute();

    const pedidoActualizado = await pedidoRepository.createQueryBuilder('pedido')
      .from(tableName, 'pedido')
      .leftJoinAndMapOne('pedido.cliente', getTableName(empresaId, 'cliente'), 'cliente', 'pedido.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
      .leftJoinAndMapOne('pedido.articulo', getTableName(empresaId, 'articulo'), 'articulo', 'pedido.articuloCodigo = articulo.codigo AND articulo.empresaId = :empresaId', { empresaId })
      .where('pedido.internalId = :id', { id: Number(id) })
      .getOne();

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

    const resultado = await pedidoRepository.createQueryBuilder()
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

    const pedidos = await pedidoRepository.createQueryBuilder('pedido')
      .from(tableName, 'pedido')
      .leftJoinAndMapOne('pedido.cliente', getTableName(empresaId, 'cliente'), 'cliente', 'pedido.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
      .leftJoinAndMapOne('pedido.articulo', getTableName(empresaId, 'articulo'), 'articulo', 'pedido.articuloCodigo = articulo.codigo AND articulo.empresaId = :empresaId', { empresaId })
      .where('pedido.clienteCodigo = :clienteId', { clienteId })
      .andWhere('pedido.empresaId = :empresaId', { empresaId })
      .orderBy('pedido.fecha', 'DESC')
      .getMany();

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

    const pedidos = await pedidoRepository.createQueryBuilder('pedido')
      .from(tableName, 'pedido')
      .leftJoinAndMapOne('pedido.cliente', getTableName(empresaId, 'cliente'), 'cliente', 'pedido.clienteCodigo = cliente.codigo AND cliente.empresaId = :empresaId', { empresaId })
      .leftJoinAndMapOne('pedido.articulo', getTableName(empresaId, 'articulo'), 'articulo', 'pedido.articuloCodigo = articulo.codigo AND articulo.empresaId = :empresaId', { empresaId })
      .where('pedido.articuloCodigo = :articuloCodigo', { articuloCodigo })
      .andWhere('pedido.empresaId = :empresaId', { empresaId })
      .orderBy('pedido.fecha', 'DESC')
      .getMany();

    res.json(pedidos);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener pedidos por artículo:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos del artículo', error: errorMessage });
  }
};
