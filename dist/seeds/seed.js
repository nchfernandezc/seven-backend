"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const Cliente_1 = require("../entities/Cliente");
const Articulo_1 = require("../entities/Articulo");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const Pedido_1 = require("../entities/Pedido");
const Vendedor_1 = require("../entities/Vendedor");
const Empresa_1 = require("../entities/Empresa");
async function seedDatabase() {
    try {
        // Inicializar la conexión a la base de datos
        await database_1.AppDataSource.initialize();
        console.log('Conexión a la base de datos establecida');
        // Obtener los repositorios
        const empresaRepository = database_1.AppDataSource.getRepository(Empresa_1.Empresa);
        const vendedorRepository = database_1.AppDataSource.getRepository(Vendedor_1.Vendedor);
        const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
        const articuloRepository = database_1.AppDataSource.getRepository(Articulo_1.Articulo);
        const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
        const pedidoRepository = database_1.AppDataSource.getRepository(Pedido_1.Pedido);
        // Limpiar tablas (opcional, ten cuidado en producción)
        await pedidoRepository.createQueryBuilder().delete().where('1 = 1').execute();
        await cxcRepository.createQueryBuilder().delete().where('1 = 1').execute();
        await articuloRepository.createQueryBuilder().delete().where('1 = 1').execute();
        await clienteRepository.createQueryBuilder().delete().where('1 = 1').execute();
        await vendedorRepository.createQueryBuilder().delete().where('1 = 1').execute();
        await empresaRepository.createQueryBuilder().delete().where('1 = 1').execute();
        // Crear empresa
        const empresa = empresaRepository.create({
            nombre: 'Empresa Demo',
            identificacion: 'J-123456789',
            direccion: 'Av. Principal #123',
            telefono: '02121234567'
        });
        await empresaRepository.save(empresa);
        // Crear vendedor
        const vendedor = vendedorRepository.create({
            codigo: 'VEN001',
            nombre: 'Juan Pérez',
            telefono: '04141234567',
            empresaId: empresa.id
        });
        await vendedorRepository.save(vendedor);
        // Crear clientes
        const cliente1 = clienteRepository.create({
            codigo: 'CLI001',
            nombre: 'Tienda Don Pepe',
            direccion: 'Av. Principal #123',
            telefono: '04141234567',
            vendedor: vendedor,
            empresaId: empresa.id,
        });
        const cliente2 = clienteRepository.create({
            codigo: 'CLI002',
            nombre: 'Supermercado El Ahorro',
            direccion: 'Calle Comercio #45',
            telefono: '04241234567',
            vendedor: vendedor,
            empresaId: empresa.id,
        });
        await clienteRepository.save([cliente1, cliente2]);
        // Crear artículos
        const articulo1 = articuloRepository.create({
            codigo: 'ART001',
            descripcion: 'Arroz 1kg',
            cantidad: 100,
            precio: 1.50,
            marca: 'Pilaf',
            clase: 'Granos',
            empresaId: empresa.id,
        });
        const articulo2 = articuloRepository.create({
            codigo: 'ART002',
            descripcion: 'Harina de Maíz 1kg',
            cantidad: 150,
            precio: 1.20,
            marca: 'Pan',
            clase: 'Harinas',
            empresaId: empresa.id,
        });
        const articulo3 = articuloRepository.create({
            codigo: 'ART003',
            descripcion: 'Aceite 1L',
            cantidad: 80,
            precio: 3.50,
            marca: 'La Favorita',
            clase: 'Aceites',
            empresaId: empresa.id,
        });
        await articuloRepository.save([articulo1, articulo2, articulo3]);
        // Crear cuentas por cobrar
        const cxc1 = cxcRepository.create({
            tipoDocumento: 'FAC',
            numero: 1001,
            saldo: 250.75,
            cliente: cliente1,
            fecha: new Date('2025-11-15'),
            empresaId: empresa.id,
        });
        const cxc2 = cxcRepository.create({
            tipoDocumento: 'FAC',
            numero: 1002,
            saldo: 180.30,
            cliente: cliente2,
            fecha: new Date('2025-11-20'),
            empresaId: empresa.id,
        });
        await cxcRepository.save([cxc1, cxc2]);
        // Crear pedidos
        const pedido1 = pedidoRepository.create({
            numero: 'PED-2025-001',
            articuloCodigo: articulo1.codigo,
            articulo: articulo1,
            cantidad: 10,
            precioVenta: 1.50,
            clienteCodigo: cliente1.codigo,
            cliente: cliente1,
            estado: 1, // Pendiente
            fecha: new Date(),
            usuario: 'admin',
            indice: 1,
            empresaId: empresa.id
        });
        const pedido2 = pedidoRepository.create({
            numero: 'PED-2025-002',
            articuloCodigo: articulo2.codigo,
            articulo: articulo2,
            cantidad: 5,
            precioVenta: 1.20,
            clienteCodigo: cliente2.codigo,
            cliente: cliente2,
            estado: 1, // Pendiente
            fecha: new Date(),
            usuario: 'admin',
            indice: 2,
            empresaId: empresa.id
        });
        await pedidoRepository.save([pedido1, pedido2]);
        console.log('Datos de prueba insertados correctamente');
        console.log(`Empresa ID: ${empresa.id}`);
        console.log(`Vendedor ID: ${vendedor.codigo}`);
        console.log('Usa estos datos para autenticarte en la aplicación');
        process.exit(0);
    }
    catch (error) {
        console.error('Error al insertar datos de prueba:', error);
        process.exit(1);
    }
}
seedDatabase();
