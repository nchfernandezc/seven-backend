import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cxcobrar, EstadoCxc } from '../entities/Cxcobrar';
import { Between, MoreThan, LessThan } from 'typeorm';
import { Cliente } from '../entities/Cliente';



type CxcWithRelations = Cxcobrar & {
  cliente: Cliente;
};

interface CxcFilter {
  fechaInicio?: string;
  fechaFin?: string;
  estado?: EstadoCxc;
  clienteId?: string;
  empresaId?: number;
  vendedorId?: string;
}

/**
 * Obtiene todas las cuentas por cobrar con filtros opcionales
 */
export const getCxcs = async (req: Request, res: Response) => {
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);

  try {
    const filter: CxcFilter = req.query;
    const queryBuilder = cxcRepository
      .createQueryBuilder('cxc')
      .leftJoinAndSelect('cxc.cliente', 'cliente')
      .leftJoinAndSelect('cliente.vendedor', 'vendedor')
      .orderBy('cxc.fecha', 'DESC');

    // Filtro por fechas
    if (filter.fechaInicio && filter.fechaFin) {
      queryBuilder.andWhere('cxc.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: new Date(filter.fechaInicio),
        fechaFin: new Date(filter.fechaFin)
      });
    } else if (filter.fechaInicio) {
      queryBuilder.andWhere('cxc.fecha >= :fechaInicio', {
        fechaInicio: new Date(filter.fechaInicio)
      });
    } else if (filter.fechaFin) {
      queryBuilder.andWhere('cxc.fecha <= :fechaFin', {
        fechaFin: new Date(filter.fechaFin)
      });
    }

    // Filtro por estado
    if (filter.estado) {
      queryBuilder.andWhere('cxc.estado = :estado', { estado: filter.estado });
    }

    // Filtro por empresa (obligatorio)
    if (filter.empresaId) {
      queryBuilder.andWhere('cxc.empresa_id = :empresaId', {
        empresaId: filter.empresaId
      });
    } else if (req.user && req.user.empresaId) {
      queryBuilder.andWhere('cxc.empresa_id = :empresaId', {
        empresaId: req.user.empresaId
      });
    } else {
      return res.status(400).json({
        message: 'Se requiere el ID de la empresa'
      });
    }

    // Filtro por vendedor
    if (filter.vendedorId) {
      queryBuilder.andWhere('cliente.cven = :vendedorId', {
        vendedorId: filter.vendedorId
      });
    } else if (req.user?.vendedorId) {
      queryBuilder.andWhere('cliente.cven = :vendedorId', {
        vendedorId: req.user.vendedorId
      });
    }

    // Filtro por cliente
    if (filter.clienteId) {
      queryBuilder.andWhere('cliente.codigo = :clienteId', {
        clienteId: filter.clienteId
      });
    }

    const cxcs = await queryBuilder.getMany();
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
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);

  try {
    const { id } = req.params;

    const cxc = await cxcRepository.findOne({
      where: { id: Number(id) },
      relations: ['cliente']
    });

    if (!cxc) {
      return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
    }

    res.json(cxc);
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
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);
  const clienteRepository = AppDataSource.getRepository(Cliente);

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { monto, clienteCodigo, empresaId } = req.body;

    // Validaciones
    if (!monto || monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser mayor a cero' });
    }

    if (!clienteCodigo) {
      return res.status(400).json({ message: 'El código de cliente es requerido' });
    }

    if (!empresaId) {
      return res.status(400).json({ message: 'El ID de empresa es requerido' });
    }

    // Verificar cliente
    const cliente = await clienteRepository.findOne({
      where: {
        codigo: clienteCodigo,
        empresaId: Number(empresaId)
      }
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Crear CXC
    const cxcData = {
      ...req.body,
      fecha: new Date(),
      estado: 'pendiente' as EstadoCxc,
      saldo: monto
    };

    const nuevoCxc = cxcRepository.create(cxcData);
    const savedResult = await cxcRepository.save(nuevoCxc);
    const savedCxc = Array.isArray(savedResult) ? savedResult[0] : savedResult;

    await queryRunner.commitTransaction();

    const cxcConRelaciones = await cxcRepository.findOne({
      where: { id: savedCxc.id },
      relations: ['cliente']
    });

    res.status(201).json(cxcConRelaciones);
  } catch (error) {
    await queryRunner.rollbackTransaction();
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
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { id } = req.params;

    const cxc = await cxcRepository.findOne({
      where: { id: Number(id) },
      relations: ['cliente']
    });

    if (!cxc) {
      return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
    }

    const { id: _, clienteCodigo, fecha, empresaId, ...updateData } = req.body;

    // Si se marca como pagado, actualizar fecha y saldo
    if (updateData.estado === 'pagado' && !updateData.fechaPago) {
      updateData.fechaPago = new Date();
    }

    if (updateData.estado === 'pagado') {
      updateData.saldo = 0;
    }

    Object.assign(cxc, updateData);
    await cxcRepository.save(cxc);

    await queryRunner.commitTransaction();

    const cxcActualizado = await cxcRepository.findOne({
      where: { id: cxc.id },
      relations: ['cliente']
    });

    res.json(cxcActualizado);
  } catch (error) {
    await queryRunner.rollbackTransaction();
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
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { id } = req.params;

    const cxc = await cxcRepository.findOneBy({ id: Number(id) });

    if (!cxc) {
      return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
    }

    if (cxc.estado === 'pagado') {
      return res.status(400).json({
        message: 'No se puede eliminar una cuenta pagada'
      });
    }

    const resultado = await cxcRepository.delete(id);

    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'No se pudo eliminar la cuenta' });
    }

    await queryRunner.commitTransaction();
    res.status(204).send();
  } catch (error) {
    await queryRunner.rollbackTransaction();
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
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);
  const { clienteId } = req.params as { clienteId: string };
  const { empresaId } = req.query as { empresaId?: string };

  try {
    const { estado, fechaInicio, fechaFin } = req.query as unknown as CxcFilter;

    const where: any = {
      clienteCodigo: clienteId
    };

    if (empresaId) {
      where.empresaId = Number(empresaId);
    }

    if (estado) {
      where.estado = estado;
    }

    if (fechaInicio && fechaFin) {
      where.fecha = Between(
        new Date(fechaInicio as string),
        new Date(fechaFin as string)
      );
    }

    const cxcs = await cxcRepository.find({
      where,
      relations: ['cliente'],
      order: { fecha: 'DESC' }
    });

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
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);

  try {
    const { clienteId } = req.params as { clienteId: string };
    const { empresaId } = req.query as { empresaId?: string };

    // Verificar permisos de vendedor
    if (req.user?.vendedorId) {
      const cliente = await AppDataSource.getRepository(Cliente).findOne({
        where: {
          codigo: clienteId,
          vendedorCodigo: req.user.vendedorId,
          ...(empresaId ? { empresaId: Number(empresaId) } : {})
        }
      });

      if (!cliente) {
        return res.status(403).json({
          message: 'No tiene permiso para ver este cliente'
        });
      }
    }

    const whereBase: any = {
      clienteCodigo: clienteId,
      ...(empresaId ? { empresaId: Number(empresaId) } : {})
    };

    const [pendientes, vencidas, pagadas] = await Promise.all([
      cxcRepository.find({
        where: {
          ...whereBase,
          estado: 'pendiente',
          fechaVencimiento: MoreThan(new Date())
        },
        select: ['id', 'monto', 'fechaVencimiento', 'tipoDocumento', 'numero']
      }),
      cxcRepository.find({
        where: {
          ...whereBase,
          estado: 'pendiente',
          fechaVencimiento: LessThan(new Date())
        },
        select: ['id', 'monto', 'fechaVencimiento', 'tipoDocumento', 'numero']
      }),
      cxcRepository.find({
        where: {
          ...whereBase,
          estado: 'pagado'
        },
        select: ['id', 'monto', 'fechaPago', 'tipoDocumento', 'numero']
      })
    ]);

    const totalPendiente = pendientes.reduce((sum, cxc) => sum + Number(cxc.monto), 0);
    const totalVencido = vencidas.reduce((sum, cxc) => sum + Number(cxc.monto), 0);
    const totalPagado = pagadas.reduce((sum, cxc) => sum + Number(cxc.monto), 0);

    res.json({
      resumen: {
        pendientes: {
          cantidad: pendientes.length,
          total: totalPendiente
        },
        vencidas: {
          cantidad: vencidas.length,
          total: totalVencido
        },
        pagadas: {
          cantidad: pagadas.length,
          total: totalPagado
        },
        totalGeneral: totalPendiente + totalVencido + totalPagado
      },
      detalle: {
        pendientes,
        vencidas,
        pagadas
      }
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
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);

  try {
    const { empresaId } = req.query as unknown as { empresaId?: number };
    const where: any = {
      estado: 'pendiente',
      fechaVencimiento: LessThan(new Date())
    };

    if (empresaId) {
      where.empresaId = Number(empresaId);
    }

    const cxcsVencidas = await cxcRepository.find({
      where,
      relations: ['cliente'],
      order: { fechaVencimiento: 'ASC' }
    });

    res.json(cxcsVencidas);
  } catch (error) {
    console.error('Error al obtener cuentas vencidas:', error);
    res.status(500).json({
      message: 'Error al obtener las cuentas vencidas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Obtiene cuentas próximas a vencer
 */
export const getCxcsPorVencer = async (req: Request, res: Response) => {
  const cxcRepository = AppDataSource.getRepository(Cxcobrar);

  try {
    const { empresaId, dias = 7 } = req.query as unknown as {
      empresaId?: number;
      dias?: number
    };

    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + Number(dias));

    const where: any = {
      estado: 'pendiente',
      fechaVencimiento: Between(hoy, fechaLimite)
    };

    if (empresaId) {
      where.empresaId = Number(empresaId);
    }

    const cxcsPorVencer = await cxcRepository.find({
      where,
      relations: ['cliente'],
      order: { fechaVencimiento: 'ASC' }
    });

    res.json(cxcsPorVencer);
  } catch (error) {
    console.error('Error al obtener cuentas por vencer:', error);
    res.status(500).json({
      message: 'Error al obtener las cuentas por vencer',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};