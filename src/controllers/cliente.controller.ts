import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Cliente } from '../entities/Cliente';

const clienteRepository = AppDataSource.getRepository(Cliente);

export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await clienteRepository.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cliente = await clienteRepository.findOneBy({ id: Number(id) });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const cliente = clienteRepository.create(req.body);
    const resultado = await clienteRepository.save(cliente);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cliente = await clienteRepository.findOneBy({ id: Number(id) });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    clienteRepository.merge(cliente, req.body);
    const resultado = await clienteRepository.save(cliente);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await clienteRepository.delete(id);
    if (resultado.affected === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
};