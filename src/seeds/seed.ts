// src/seeds/seed.ts
import { AppDataSource } from '../config/database';
import { Cliente } from '../entities/Cliente';
import { Articulo } from '../entities/Articulo';
import { Cxcobrar } from '../entities/Cxcobrar';
import { Pedido } from '../entities/Pedido';
import { Vendedor } from '../entities/Vendedor';
import { Empresa } from '../entities/Empresa';
import { SyncLog } from '../entities/SyncLog';

// src/seeds/seed.ts

async function clearDatabase() {
  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    // Desactivar temporalmente las restricciones de clave foránea
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    // Definir el orden de eliminación basado en las relaciones de clave foránea
    // Primero las tablas hijas, luego las tablas padre
    const tablesInOrder = [
      'pedidos',
      'cxcobrar',
      'articulos',
      'clientes',
      'vendedores',
      'empresas',
      'sync_logs'
    ];
    
    console.log('Vaciando tablas en orden...');
    
    // Usar DELETE para todas las tablas para evitar problemas con TRUNCATE y claves foráneas
    for (const tableName of tablesInOrder) {
      try {
        console.log(`Vaciando tabla: ${tableName}`);
        await queryRunner.query(`DELETE FROM \`${tableName}\`;`);
        // Resetear el auto_increment
        await queryRunner.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1;`);
        console.log(`✓ Tabla ${tableName} vaciada correctamente`);
      } catch (error) {
        console.error(`Error al vaciar la tabla ${tableName}:`, error);
        throw error; // Relanzar el error para manejarlo en el catch externo
      }
    }
    
    await queryRunner.commitTransaction();
    console.log('Base de datos limpiada exitosamente');
    
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    try {
      // Reactivar las restricciones de clave foránea
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
      console.log('Restricciones de clave foránea reactivadas');
    } finally {
      await queryRunner.release();
    }
  }
}

async function seedDatabase() {
  try {
    // Inicializar la conexión a la base de datos
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    await clearDatabase();

    // Obtener los repositorios
    const empresaRepository = AppDataSource.getRepository(Empresa);
    const vendedorRepository = AppDataSource.getRepository(Vendedor);
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const articuloRepository = AppDataSource.getRepository(Articulo);
    const cxcRepository = AppDataSource.getRepository(Cxcobrar);
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const syncLogRepository = AppDataSource.getRepository(SyncLog);

    // No necesitamos limpiar las tablas aquí ya que ya lo hicimos en clearDatabase()
    // Usamos una consulta directa para asegurarnos de que no se use TRUNCATE
    const repositories = [
      syncLogRepository,
      pedidoRepository,
      cxcRepository,
      articuloRepository,
      clienteRepository,
      vendedorRepository,
      empresaRepository
    ];
    
    // Desactivar temporalmente las restricciones de clave foránea
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    // Eliminar registros usando DELETE
    for (const repository of repositories) {
      await repository.query('DELETE FROM ' + repository.metadata.tableName);
    }
    
    // Reactivar las restricciones de clave foránea
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

    // Crear empresa
    const empresa = empresaRepository.create({
      nombre: 'Empresa Demo',
      identificacion: 'J-123456789',
      direccion: 'Av. Principal #123',
      telefono: '02121234567',
      // Campos de sincronización
      lastSyncedAt: new Date(),
      isDeleted: false,
      deviceId: 'seed-script'
    });
    await empresaRepository.save(empresa);

    // Crear vendedor
    const vendedor = vendedorRepository.create({
      codigo: 'VEN001',
      nombre: 'Juan Pérez',
      telefono: '04141234567',
      empresaId: empresa.id,
      // Campos de sincronización
      lastSyncedAt: new Date(),
      isDeleted: false,
      deviceId: 'seed-script'
    });
    await vendedorRepository.save(vendedor);

    // Crear cliente
    const cliente1 = clienteRepository.create({
      codigo: 'CLI001',
      nombre: 'Cliente Uno',
      direccion: 'Calle 1 #2-3',
      telefono: '04141234568',
      vendedorCodigo: vendedor.codigo,
      empresaId: empresa.id,
      // Campos de sincronización
      lastSyncedAt: new Date(),
      isDeleted: false,
      deviceId: 'seed-script'
    });
    await clienteRepository.save(cliente1);

    // Crear artículo
    const articulo1 = articuloRepository.create({
      codigo: 'ART001',
      descripcion: 'Producto de ejemplo 1',
      cantidad: 100,
      precio: 100.00,
      marca: 'Marca1',
      clase: 'Clase1',
      empresaId: empresa.id,
      // Campos de sincronización
      lastSyncedAt: new Date(),
      isDeleted: false,
      deviceId: 'seed-script'
    });
    await articuloRepository.save(articulo1);

    // Crear pedido
    const pedido = pedidoRepository.create({
      numero: 'PED-001',
      articuloCodigo: articulo1.codigo,
      cantidad: 2,
      precioVenta: 100.00,
      clienteCodigo: cliente1.codigo,
      estado: 1, // 1: Pendiente
      fecha: new Date(),
      usuario: 'admin',
      indice: 1,
      empresaId: empresa.id,
      // Campos de sincronización
      lastSyncedAt: new Date(),
      isDeleted: false,
      deviceId: 'seed-script'
    });
    await pedidoRepository.save(pedido);

    // Crear cuenta por cobrar
    const cxc = cxcRepository.create({
      tipoDocumento: 'FAC', // Must be a valid document type (e.g., 'FAC', 'NCR', 'NDB')
      numero: 1001, // Changed to number type
      monto: 200.00, // Added required monto field
      saldo: 200.00,
      clienteCodigo: cliente1.codigo, // Changed from clienteId to clienteCodigo
      fecha: new Date(),
      empresaId: empresa.id,
      // Campos de sincronización
      lastSyncedAt: new Date(),
      isDeleted: false,
      deviceId: 'seed-script'
    });
    await cxcRepository.save(cxc);

    // Crear un registro de sincronización de ejemplo
    const syncLog = syncLogRepository.create({
      entityName: 'empresa',
      entityId: empresa.id,
      operation: 'CREATE',
      deviceId: 'seed-script',
      isSynced: true
    });
    await syncLogRepository.save(syncLog);

    console.log('Base de datos sembrada exitosamente');
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
    if (error instanceof Error) {
      console.error('Error detallado:', error.message);
      console.error('Stack trace:', error.stack);
    }
  } finally {
    // Cerrar la conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seedDatabase();