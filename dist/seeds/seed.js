"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const Cliente_1 = require("../entities/Cliente");
const Articulo_1 = require("../entities/Articulo");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const Pedido_1 = require("../entities/Pedido");
async function seedDatabase() {
    try {
        // Inicializar la conexión a la base de datos
        await database_1.AppDataSource.initialize();
        console.log('Conexión a la base de datos establecida');
        // Obtener los repositorios
        const clienteRepository = database_1.AppDataSource.getRepository(Cliente_1.Cliente);
        const articuloRepository = database_1.AppDataSource.getRepository(Articulo_1.Articulo);
        const cxcRepository = database_1.AppDataSource.getRepository(Cxcobrar_1.Cxcobrar);
        const pedidoRepository = database_1.AppDataSource.getRepository(Pedido_1.Pedido);
        // Limpiar tablas (opcional, ten cuidado en producción)
        // Usamos una condición que siempre será verdadera para evitar el error de criterios vacíos
        await pedidoRepository.createQueryBuilder().delete().where('1 = 1').execute();
        await cxcRepository.createQueryBuilder().delete().where('1 = 1').execute();
        await articuloRepository.createQueryBuilder().delete().where('1 = 1').execute();
        await clienteRepository.createQueryBuilder().delete().where('1 = 1').execute();
        // Crear clientes
        const cliente1 = clienteRepository.create({
            codigo: 'CLI001',
            nombre: 'Tienda Don Pepe',
            direccion: 'Av. Principal #123',
            telefono: '04141234567',
            vendedorId: 'VEN001',
        });
        const cliente2 = clienteRepository.create({
            codigo: 'CLI002',
            nombre: 'Supermercado El Ahorro',
            direccion: 'Calle Comercio #45',
            telefono: '04241234567',
            vendedorId: 'VEN001',
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
        });
        const articulo2 = articuloRepository.create({
            codigo: 'ART002',
            descripcion: 'Harina de Maíz 1kg',
            cantidad: 150,
            precio: 1.20,
            marca: 'Pan',
            clase: 'Harinas',
        });
        const articulo3 = articuloRepository.create({
            codigo: 'ART003',
            descripcion: 'Aceite 1L',
            cantidad: 80,
            precio: 3.50,
            marca: 'La Favorita',
            clase: 'Aceites',
        });
        await articuloRepository.save([articulo1, articulo2, articulo3]);
        // Crear cuentas por cobrar
        const cxc1 = cxcRepository.create({
            tipoDocumento: 'FAC',
            numero: 1001,
            saldo: 250.75,
            clienteCodigo: 'CLI001',
            fecha: new Date('2025-11-15'),
        });
        const cxc2 = cxcRepository.create({
            tipoDocumento: 'FAC',
            numero: 1002,
            saldo: 180.30,
            clienteCodigo: 'CLI002',
            fecha: new Date('2025-11-20'),
        });
        await cxcRepository.save([cxc1, cxc2]);
        // Crear pedidos
        const pedido1 = pedidoRepository.create({
            numero: 'PED-2025-001',
            articuloCodigo: 'ART001',
            cantidad: 10,
            precioVenta: 1.50,
            clienteCodigo: 'CLI001',
            estado: 1, // Pendiente
            fecha: new Date(),
            usuario: 'admin',
            indice: 1,
        });
        const pedido2 = pedidoRepository.create({
            numero: 'PED-2025-002',
            articuloCodigo: 'ART002',
            cantidad: 5,
            precioVenta: 1.20,
            clienteCodigo: 'CLI002',
            estado: 1, // Pendiente
            fecha: new Date(),
            usuario: 'admin',
            indice: 2,
        });
        await pedidoRepository.save([pedido1, pedido2]);
        console.log('Datos de prueba insertados correctamente');
        process.exit(0);
    }
    catch (error) {
        console.error('Error al insertar datos de prueba:', error);
        process.exit(1);
    }
}
seedDatabase();
