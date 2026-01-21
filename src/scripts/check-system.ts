import { AppDataSource, initializeDatabase } from '../config/database';
import { Empresa } from '../entities/Empresa';
import { Usuario } from '../entities/Usuario';
import { Articulo } from '../entities/Articulo';
import { Cliente } from '../entities/Cliente';
import { Pedido } from '../entities/Pedido';
import { Cxcobrar } from '../entities/Cxcobrar';

/**
 * Script unificado de verificación del sistema
 * Ejecuta comprobaciones de conexión, tablas y datos principales.
 * 
 * Uso: npx ts-node src/scripts/check-system.ts
 */

const checkSystem = async () => {
    try {
        console.log('\n=============================================');
        console.log('🚀 INICIANDO VERIFICACIÓN DEL SISTEMA');
        console.log('=============================================\n');

        // 1. Verificar Conexión a Base de Datos
        console.log('📡 Verificando conexión a Base de Datos...');
        await initializeDatabase();
        console.log('✅ Conexión establecida correctamente.\n');

        // 2. Verificar Tablas (Metadatos)
        console.log('📋 Verificando Entidades/Tablas registradas en TypeORM...');
        const entities = AppDataSource.entityMetadatas;
        if (entities.length === 0) {
            console.warn('⚠️ No se encontraron entidades registradas.');
        } else {
            entities.forEach((entity) => {
                console.log(`   - Entidad: ${entity.name} -> Tabla: ${entity.tableName}`);
            });
            console.log(`✅ Total entidades encontradas: ${entities.length}\n`);
        }

        // 3. Verificar Datos de Empresas
        console.log('🏢 Verificando Empresas...');
        const empresaRepo = AppDataSource.getRepository(Empresa);
        const empresasCount = await empresaRepo.count();
        console.log(`   - Total Empresas: ${empresasCount}`);
        if (empresasCount > 0) {
            const empresas = await empresaRepo.find({ take: 3 });
            empresas.forEach(e => console.log(`     * ID: ${e.id}, Nombre: ${e.nombre}, RIF: ${e.identificacion}`));
        } else {
            console.warn('⚠️ No hay empresas registradas.');
        }
        console.log('');

        // 4. Verificar Datos de Usuarios (Vendedores)
        console.log('👤 Verificando Usuarios (a_usuario)...');
        const usuarioRepo = AppDataSource.getRepository(Usuario);
        const usuariosCount = await usuarioRepo.count();
        console.log(`   - Total Usuarios: ${usuariosCount}`);
        if (usuariosCount > 0) {
            const usuarios = await usuarioRepo.find({ take: 3 });
            usuarios.forEach(u => console.log(`     * Código: ${u.vendedor}, Nombre: ${u.usuario}, Empresa ID: ${u.id}`));
        }
        console.log('');

        // 5. Verificar Datos de Artículos
        console.log('📦 Verificando Artículos...');
        const articuloRepo = AppDataSource.getRepository(Articulo);
        const articulosCount = await articuloRepo.count();
        console.log(`   - Total Artículos: ${articulosCount}`);
        if (articulosCount > 0) {
            const articulos = await articuloRepo.find({ take: 3 });
            articulos.forEach(a => console.log(`     * Código: ${a.ccod}, Desc: ${a.cdet}, Precio: ${a.npre1}`));
        }
        console.log('');

        // 6. Verificar Clientes
        console.log('👥 Verificando Clientes...');
        const clienteRepo = AppDataSource.getRepository(Cliente);
        const clientesCount = await clienteRepo.count();
        console.log(`   - Total Clientes: ${clientesCount}\n`);

        // 7. Verificar Pedidos
        console.log('🛒 Verificando Pedidos...');
        const pedidosRepo = AppDataSource.getRepository(Pedido);
        const pedidosCount = await pedidosRepo.count();
        console.log(`   - Total Pedidos: ${pedidosCount}\n`);

        // 8. Verificar CXC
        console.log('💰 Verificando Cuentas por Cobrar (CXC)...');
        const cxcRepo = AppDataSource.getRepository(Cxcobrar);
        const cxcCount = await cxcRepo.count();
        console.log(`   - Total CXC: ${cxcCount}\n`);

        console.log('=============================================');
        console.log('✅ VERIFICACIÓN COMPLETADA EXITOSAMENTE');
        console.log('=============================================\n');

    } catch (error) {
        console.error('\n❌ ERROR DURANTE LA VERIFICACIÓN:', error);
        process.exit(1);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
};

checkSystem();
