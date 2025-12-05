"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/seeds/seed.ts
const database_1 = require("../config/database");
const Cliente_1 = require("../entities/Cliente");
const Articulo_1 = require("../entities/Articulo");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const Pedido_1 = require("../entities/Pedido");
const Vendedor_1 = require("../entities/Vendedor");
const Empresa_1 = require("../entities/Empresa");
const SyncLog_1 = require("../entities/SyncLog");
async function clearDatabase() {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        console.log('Vaciando tablas en orden...');
        // Orden de eliminación basado en las relaciones
        const tablesInOrder = [
            'pedidos',
            'cxcobrar',
            'articulos',
            'clientes',
            'vendedores',
            'empresas',
            'sync_logs'
        ];
        // Desactivar temporalmente las restricciones
        await queryRunner.query('SET CONSTRAINTS ALL DEFERRED;');
        for (const tableName of tablesInOrder) {
            try {
                console.log(`Vaciando tabla: ${tableName}`);
                await queryRunner.query(`DELETE FROM "${tableName}";`);
                // Intentar resetear la secuencia si existe
                try {
                    await queryRunner.query(`ALTER SEQUENCE IF EXISTS "${tableName}_id_seq" RESTART WITH 1;`);
                }
                catch (seqError) {
                    console.log(`No se pudo resetear la secuencia para ${tableName}`);
                }
                console.log(`✓ Tabla ${tableName} vaciada correctamente`);
            }
            catch (error) {
                console.error(`Error al vaciar la tabla ${tableName}:`, error);
                throw error;
            }
        }
        await queryRunner.commitTransaction();
        console.log('Base de datos limpiada exitosamente');
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error al limpiar la base de datos:', error);
        throw error;
    }
    finally {
        try {
            await queryRunner.query('SET CONSTRAINTS ALL IMMEDIATE;');
        }
        finally {
            await queryRunner.release();
        }
    }
}
async function seedDatabase() {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    try {
        // Inicializar la conexión
        await database_1.AppDataSource.initialize();
        console.log('Conexión a la base de datos establecida');
        // Iniciar transacción para la inserción de datos
        await queryRunner.connect();
        await queryRunner.startTransaction();
        await queryRunner.query('SET CONSTRAINTS ALL DEFERRED;');
        try {
            // Obtener los repositorios
            const empresaRepository = queryRunner.manager.getRepository(Empresa_1.Empresa);
            const vendedorRepository = queryRunner.manager.getRepository(Vendedor_1.Vendedor);
            const clienteRepository = queryRunner.manager.getRepository(Cliente_1.Cliente);
            const articuloRepository = queryRunner.manager.getRepository(Articulo_1.Articulo);
            const cxcRepository = queryRunner.manager.getRepository(Cxcobrar_1.Cxcobrar);
            const pedidoRepository = queryRunner.manager.getRepository(Pedido_1.Pedido);
            const syncLogRepository = queryRunner.manager.getRepository(SyncLog_1.SyncLog);
            // 1. Crear empresa
            const empresa = empresaRepository.create({
                nombre: 'Empresa Demo',
                identificacion: 'J-123456789',
                direccion: 'Av. Principal #123',
                telefono: '02121234567',
                lastSyncedAt: new Date(),
                isDeleted: false,
                deviceId: 'seed-script'
            });
            await empresaRepository.save(empresa);
            console.log('✓ Empresa creada');
            // 2. Crear vendedor
            const vendedor = vendedorRepository.create({
                codigo: 'VEN001',
                nombre: 'Juan Pérez',
                telefono: '04141234567',
                empresaId: empresa.id,
                lastSyncedAt: new Date(),
                isDeleted: false,
                deviceId: 'seed-script'
            });
            await vendedorRepository.save(vendedor);
            console.log('✓ Vendedor creado');
            // 3. Crear cliente
            const cliente1 = clienteRepository.create({
                codigo: 'CLI001',
                nombre: 'Cliente Uno',
                direccion: 'Calle 1 #2-3',
                telefono: '04141234568',
                vendedorCodigo: vendedor.codigo,
                empresaId: empresa.id,
                lastSyncedAt: new Date(),
                isDeleted: false,
                deviceId: 'seed-script'
            });
            await clienteRepository.save(cliente1);
            console.log('✓ Cliente creado');
            // 4. Crear artículo
            const articulo1 = articuloRepository.create({
                codigo: 'ART001',
                descripcion: 'Producto de ejemplo 1',
                cantidad: 100,
                precio: 100.00,
                marca: 'Marca1',
                clase: 'Clase1',
                empresaId: empresa.id,
                lastSyncedAt: new Date(),
                isDeleted: false,
                deviceId: 'seed-script'
            });
            await articuloRepository.save(articulo1);
            console.log('✓ Artículo creado');
            // 5. Crear pedido
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
                lastSyncedAt: new Date(),
                isDeleted: false,
                deviceId: 'seed-script'
            });
            await pedidoRepository.save(pedido);
            console.log('✓ Pedido creado');
            // 6. Crear cuenta por cobrar
            const cxc = cxcRepository.create({
                tipoDocumento: 'FAC',
                numero: 1001,
                monto: 200.00,
                saldo: 200.00,
                clienteCodigo: cliente1.codigo,
                fecha: new Date(),
                empresaId: empresa.id,
                lastSyncedAt: new Date(),
                isDeleted: false,
                deviceId: 'seed-script'
            });
            await cxcRepository.save(cxc);
            console.log('✓ Cuenta por cobrar creada');
            // 7. Crear log de sincronización
            const syncLog = syncLogRepository.create({
                entityName: 'empresa',
                entityId: empresa.id,
                operation: 'CREATE',
                deviceId: 'seed-script',
                isSynced: true
            });
            await syncLogRepository.save(syncLog);
            console.log('✓ Log de sincronización creado');
            await queryRunner.commitTransaction();
            console.log('✅ Datos de prueba insertados correctamente');
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error al insertar datos de prueba:', error);
            throw error;
        }
    }
    catch (error) {
        console.error('Error en el proceso de seed:', error);
        throw error;
    }
    finally {
        try {
            if (queryRunner) {
                await queryRunner.query('SET CONSTRAINTS ALL IMMEDIATE;');
                await queryRunner.release();
            }
            if (database_1.AppDataSource.isInitialized) {
                await database_1.AppDataSource.destroy();
            }
        }
        catch (e) {
            console.error('Error al liberar recursos:', e);
        }
    }
}
// Ejecutar el seed
seedDatabase()
    .then(() => {
    console.log('✅ Proceso de seed completado exitosamente');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Error durante el proceso de seed:', error);
    process.exit(1);
});
