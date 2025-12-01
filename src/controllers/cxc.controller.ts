import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cxcobrar } from '../entities/Cxcobrar';

const cxcRepository = AppDataSource.getRepository(Cxcobrar);

export const getCxcs = async (req: Request, res: Response) => {
  try {
    const cxcs = await cxcRepository.find({ 
      relations: ['cliente'] 
    });
    res.json(cxcs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las cuentas por cobrar', error });
  }
};

export const getCxcById = async (req: Request, res: Response) => {
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
    res.status(500).json({ message: 'Error al obtener la cuenta por cobrar', error });
  }
};

export const createCxc = async (req: Request, res: Response) => {
  try {
    const cxc = cxcRepository.create(req.body);
    const resultado = await cxcRepository.save(cxc);
    
    // If resultado is an array, take the first element
    const savedCxc = Array.isArray(resultado) ? resultado[0] : resultado;
    
    // Cargar la relación con cliente en la respuesta
    const cxcConRelaciones = await cxcRepository.findOne({
      where: { id: savedCxc.id },
      relations: ['cliente']
    });
    
    res.status(201).json(cxcConRelaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cuenta por cobrar', error });
  }
};

export const updateCxc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cxc = await cxcRepository.findOneBy({ id: Number(id) });
    if (!cxc) {
      return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
    }
    cxcRepository.merge(cxc, req.body);
    const resultado = await cxcRepository.save(cxc);
    // Cargar la relación con cliente en la respuesta
    const cxcActualizado = await cxcRepository.findOne({
      where: { id: resultado.id },
      relations: ['cliente']
    });
    res.json(cxcActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cuenta por cobrar', error });
  }
};

export const deleteCxc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await cxcRepository.delete(id);
    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'Cuenta por cobrar no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cuenta por cobrar', error });
  }
};

// Obtener cuentas por cobrar por cliente
export const getCxcsByCliente = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const cxcs = await cxcRepository.find({
      where: { clienteCodigo: clienteId },
      relations: ['cliente']
    });
    res.json(cxcs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las cuentas por cobrar del cliente', error });
  }
};