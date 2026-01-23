import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { getTableName } from '../utils/tableName';

/**
 * Obtiene todos los pedidos con sus relaciones
 */
export const getPedidos = async (req: Request, res: Response) => {
  try {
    const { empresaId } = (req as any).user || {};
    if (!empresaId) return res.status(403).json({ message: 'Empresa no identificada' });

    const pedidoTable = getTableName(empresaId, 'pedido');
    const clienteTable = getTableName(empresaId, 'cliente');
    const articuloTable = getTableName(empresaId, 'articulo');

    // Usamos AppDataSource.createQueryBuilder para evitar conflictos de metadatos de Entidad
    // con las tablas dinámicas. Esto emula el éxito que tuvimos con Artículos.
    const pedidos = await AppDataSource.createQueryBuilder()
      .select('p.*')
      .addSelect('c.cdet', 'cliente_nombre') // Alias para facilitar frontend
      .addSelect('a.cdet', 'articulo_descripcion')
      .from(pedidoTable, 'p')
      .leftJoin(clienteTable, 'c', 'p.cli = c.ccod AND c.id = :empresaId', { empresaId })
      .leftJoin(articuloTable, 'a', 'p.cod = a.ccod AND a.id = :empresaId', { empresaId })
      .where('p.id = :empresaId', { empresaId })
      .orderBy('p.dfec', 'DESC')
      .getRawMany();

    // Mapeamos para anidar objetos si el front lo espera (opcional, pero seguro)
    const result = pedidos.map(row => ({
      ...row,
      cliente: { cnom: row.cliente_nombre }, // Estructura simulada de relación
      articulo: { cdes: row.articulo_descripcion }
    }));

    res.json(result);
  } catch (error) {
    console.error('[Pedidos] Get Error:', error);
    res.status(500).json({
      message: 'Error al obtener los pedidos',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

/**
 * Crea un pedido validando los datos (Solo inserción)
 */
export const createPedido = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    const { empresaId, vendedorId } = (req as any).user || {};
    if (!empresaId) return res.status(403).json({ message: 'Empresa no identificada' });

    const { num, cod, des, can, pre, cli } = req.body;

    // Validación básica
    if (!cod || !cli || can === undefined || pre === undefined) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (Articulo, Cliente, Cantidad, Precio)' });
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const pedidoTable = getTableName(empresaId, 'pedido');

    await queryRunner.manager.createQueryBuilder()
      .insert()
      .into(pedidoTable)
      .values({
        num: num || `PED-${Date.now()}`,
        ven: vendedorId || 'VEN001',
        cod: cod,
        des: des || '',
        can: Number(can),
        pre: Number(pre),
        cli: cli,
        id: empresaId,
        dfec: new Date(),
        itip: 1
      })
      .execute();

    await queryRunner.commitTransaction();

    // Recuperamos el ID generado buscando por el número único o timestamp
    // (insertId a veces no es fiable en todos los drivers con tablas legacy)
    res.status(201).json({ success: true, message: 'Pedido creado correctamente' });

  } catch (error) {
    if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
    console.error('[Pedidos] Create Error:', error);
    res.status(500).json({
      message: 'Error al crear el pedido',
      error: error instanceof Error ? error.message : String(error)
    });
  } finally {
    await queryRunner.release();
  }
};

export const getPedidoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = (req as any).user || {};
    const pedidoTable = getTableName(empresaId, 'pedido');
    const clienteTable = getTableName(empresaId, 'cliente');
    const articuloTable = getTableName(empresaId, 'articulo');

    const pedido = await AppDataSource.createQueryBuilder()
      .select('p.*')
      .addSelect('c.cdet', 'cliente_nombre')
      .addSelect('a.cdet', 'articulo_descripcion')
      .from(pedidoTable, 'p')
      .leftJoin(clienteTable, 'c', 'p.cli = c.ccod AND c.id = :empresaId', { empresaId })
      .leftJoin(articuloTable, 'a', 'p.cod = a.ccod AND a.id = :empresaId', { empresaId })
      .where('p.xxx = :id AND p.id = :empresaId', { id, empresaId })
      .getRawOne();

    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    const result = {
      ...pedido,
      cliente: { cnom: pedido.cliente_nombre },
      articulo: { cdes: pedido.articulo_descripcion }
    };

    res.json(result);
  } catch (error) {
    console.error('[Pedidos] GetById Error:', error);
    res.status(500).json({ message: 'Error al obtener el pedido' });
  }
};

export const getPedidosByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const { empresaId } = (req as any).user || {};
    const pedidoTable = getTableName(empresaId, 'pedido');

    const pedidos = await AppDataSource.createQueryBuilder()
      .select('p.*')
      .from(pedidoTable, 'p')
      .where('p.cli = :clienteId AND p.id = :empresaId', { clienteId, empresaId })
      .orderBy('p.dfec', 'DESC')
      .getRawMany();

    res.json(pedidos);
  } catch (error) {
    console.error('[Pedidos] GetByClient Error:', error);
    res.status(500).json({ message: 'Error al obtener pedidos del cliente' });
  }
};
