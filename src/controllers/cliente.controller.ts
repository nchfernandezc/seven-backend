import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cliente } from '../entities/Cliente';

const clienteRepository = AppDataSource.getRepository(Cliente);

// Interfaz para extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        empresaId: number;
        vendedorId?: string;
      };
    }
  }
}

export const getClientes = async (req: Request, res: Response) => {
  try {
    const { empresaId, vendedorId } = req.user || {};
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    const queryBuilder = clienteRepository
      .createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.vendedor', 'vendedor')
      .where('cliente.empresaId = :empresaId', { empresaId })
      .orderBy('cliente.nombre', 'ASC');

    // Si hay un vendedorId en el usuario, filtrar por ese vendedor
    if (vendedorId) {
      // CAMBIAR ESTA LÍNEA:
      queryBuilder.andWhere('cliente.vendedorCodigo = :vendedorId', { vendedorId });
      //                              ^^^^^^^^^^^^^^ USAR vendedorCodigo
    }

    const clientes = await queryBuilder.getMany();
    
    res.json(clientes);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener los clientes';
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ 
      message: 'Error al obtener los clientes', 
      error: errorMessage 
    });
  }
};

export const buscarClientes = async (req: Request, res: Response) => {
  try {
    const { q } = req.query; // ← Asegúrate de que esté así
    const { empresaId, vendedorId } = req.user || {};
    
    console.log('=== BUSCAR CLIENTES ===');
    console.log('Query param q:', q);
    console.log('Type of q:', typeof q);
    console.log('empresaId:', empresaId);
    console.log('vendedorId:', vendedorId);
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    if (!q || typeof q !== 'string') {
      console.log('ERROR: Parámetro q inválido');
      return res.status(400).json({ 
        message: 'Parámetro de búsqueda requerido',
        received: { q, type: typeof q }
      });
    }

    const queryBuilder = clienteRepository
      .createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.vendedor', 'vendedor')
      .where('cliente.empresaId = :empresaId', { empresaId })
      .andWhere(
        '(LOWER(cliente.nombre) LIKE LOWER(:search) OR LOWER(cliente.codigo) LIKE LOWER(:search) OR cliente.telefono LIKE :search)',
        { search: `%${q}%` }
      )
      .orderBy('cliente.nombre', 'ASC');

    if (vendedorId) {
      queryBuilder.andWhere('cliente.vendedorCodigo = :vendedorId', { vendedorId });
    }

    const clientes = await queryBuilder.getMany();
    
    console.log(`Encontrados ${clientes.length} clientes`);
    res.json(clientes);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al buscar clientes';
    console.error('Error al buscar clientes:', error);
    res.status(500).json({ 
      message: 'Error al buscar clientes', 
      error: errorMessage 
    });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // AGREGAR ESTA VALIDACIÓN:
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const cliente = await clienteRepository.findOne({
      where: { 
        id: Number(id),
        empresaId 
      },
      relations: ['vendedor']
    });

    if (!cliente) {
      return res.status(404).json({ 
        message: 'Cliente no encontrado o no pertenece a su empresa' 
      });
    }
    
    res.json(cliente);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener el cliente';
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ message: 'Error al obtener el cliente', error: errorMessage });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.user || {};
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar si ya existe un cliente con el mismo código en la misma empresa
    const existingCliente = await clienteRepository.findOne({
      where: { 
        codigo: req.body.codigo,
        empresaId 
      }
    });

    if (existingCliente) {
      return res.status(400).json({ 
        message: 'Ya existe un cliente con el mismo código en esta empresa' 
      });
    }

    const cliente = clienteRepository.create({
      ...req.body,
      empresaId // Asegurarse de que el cliente se asocie a la empresa del usuario
    });
    
    const resultado = await clienteRepository.save(cliente);
    res.status(201).json(resultado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear el cliente';
    console.error('Error al crear cliente:', error);
    res.status(500).json({ message: 'Error al crear el cliente', error: errorMessage });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Buscar el cliente asegurando que pertenezca a la empresa
    const cliente = await clienteRepository.findOne({
      where: { 
        id: Number(id),
        empresaId 
      }
    });
    
    if (!cliente) {
      return res.status(404).json({ 
        message: 'Cliente no encontrado o no tiene permisos para modificarlo' 
      });
    }

    // Si se está actualizando el código, verificar que no exista otro con el mismo código
    if (req.body.codigo && req.body.codigo !== cliente.codigo) {
      const existingCliente = await clienteRepository.findOne({
        where: { 
          codigo: req.body.codigo,
          empresaId 
        }
      });

      if (existingCliente) {
        return res.status(400).json({ 
          message: 'Ya existe otro cliente con el mismo código en esta empresa' 
        });
      }
    }

    // Actualizar el cliente
    clienteRepository.merge(cliente, req.body);
    const resultado = await clienteRepository.save(cliente);
    
    res.json(resultado);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar el cliente';
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar el cliente', error: errorMessage });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { empresaId } = req.user || {};
    
    if (!empresaId) {
      return res.status(403).json({ message: 'No se ha especificado la empresa' });
    }

    // Verificar que el cliente pertenezca a la empresa antes de eliminarlo
    const resultado = await clienteRepository.delete({
      id: Number(id),
      empresaId
    });
    
    if (resultado.affected === 0) {
      return res.status(404).json({ 
        message: 'Cliente no encontrado o no tiene permisos para eliminarlo' 
      });
    }
    
    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el cliente';
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el cliente', 
      error: errorMessage 
    });
  }
};