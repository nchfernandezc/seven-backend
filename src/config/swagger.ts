import swaggerJsdoc from 'swagger-jsdoc';
const { version } = require('../../package.json');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Pedidos',
      version,
      description: 'API para la gestión de pedidos, clientes, artículos y cuentas por cobrar',
      contact: {
        name: 'Soporte',
        email: 'soporte@tudominio.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        Cliente: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            codigo: { type: 'string' },
            nombre: { type: 'string' },
            direccion: { type: 'string', nullable: true },
            telefono: { type: 'string', nullable: true },
            vendedorId: { type: 'string' }
          }
        },
        Articulo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            codigo: { type: 'string' },
            descripcion: { type: 'string' },
            cantidad: { type: 'number', format: 'float' },
            precio: { type: 'number', format: 'float' },
            marca: { type: 'string', nullable: true },
            clase: { type: 'string', nullable: true }
          }
        },
        Cxcobrar: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            tipoDocumento: { type: 'string' },
            numero: { type: 'integer' },
            saldo: { type: 'number', format: 'float' },
            clienteCodigo: { type: 'string' },
            fecha: { type: 'string', format: 'date-time' }
          }
        },
        Pedido: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            numero: { type: 'string' },
            articuloCodigo: { type: 'string' },
            cantidad: { type: 'number', format: 'float' },
            precioVenta: { type: 'number', format: 'float' },
            clienteCodigo: { type: 'string' },
            estado: { type: 'integer', enum: [1, 2, 3], description: '1: Pendiente, 2: Procesado, 3: Anulado' },
            fecha: { type: 'string', format: 'date-time' },
            usuario: { type: 'string' },
            indice: { type: 'integer' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // Ruta a los archivos de rutas
};

const specs = swaggerJsdoc(options);

export default specs;