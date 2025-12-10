import swaggerJsdoc from 'swagger-jsdoc';
const { version } = require('../../package.json');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Seven API - Sistema de Gestión Comercial',
      version,
      description: `
        API REST para la gestión de pedidos, clientes, artículos y cuentas por cobrar.
        
        ## Características
        - Gestión completa de pedidos
        - Control de inventario
        - Administración de clientes
        - Cuentas por cobrar (CXC)
        - Soporte multi-empresa
        - Sincronización offline
        
        ## Autenticación
        Esta API utiliza headers personalizados para identificar la empresa y el vendedor:
        - \`x-company-id\`: ID de la empresa
        - \`x-salesperson-id\`: Código del vendedor
      `,
      contact: {
        name: 'Soporte Técnico',
        email: 'soporte@seven.com'
      },
      license: {
        name: 'Privado',
        url: 'https://example.com/license'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.seven.com',
        description: 'Servidor de producción'
      }
    ],
    tags: [
      {
        name: 'Artículos',
        description: 'Gestión de artículos e inventario'
      },
      {
        name: 'Clientes',
        description: 'Gestión de clientes'
      },
      {
        name: 'Pedidos',
        description: 'Gestión de pedidos y órdenes'
      },
      {
        name: 'CXC',
        description: 'Cuentas por cobrar'
      },
      {
        name: 'Empresas',
        description: 'Gestión de empresas'
      },
      {
        name: 'Vendedores',
        description: 'Gestión de vendedores'
      },
      {
        name: 'Sincronización',
        description: 'Logs y control de sincronización'
      },
      {
        name: 'Autenticación',
        description: 'Validación y autenticación'
      }
    ],
    components: {
      securitySchemes: {
        CompanyHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-company-id',
          description: 'ID de la empresa'
        },
        SalespersonHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-salesperson-id',
          description: 'Código del vendedor'
        }
      },
      schemas: {
        // ============================================
        // ARTÍCULOS
        // ============================================
        Articulo: {
          type: 'object',
          required: ['codigo', 'descripcion', 'precio'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del artículo',
              example: 1
            },
            codigo: {
              type: 'string',
              description: 'Código único del artículo',
              example: 'ART001'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del artículo',
              example: 'Laptop Dell Inspiron 15'
            },
            cantidad: {
              type: 'number',
              format: 'float',
              description: 'Cantidad en stock',
              example: 10.5
            },
            precio: {
              type: 'number',
              format: 'float',
              description: 'Precio unitario',
              example: 599.99
            },
            marca: {
              type: 'string',
              nullable: true,
              description: 'Marca del artículo',
              example: 'Dell'
            },
            clase: {
              type: 'string',
              nullable: true,
              description: 'Clase o categoría',
              example: 'Electrónica'
            },
            empresaId: {
              type: 'integer',
              description: 'ID de la empresa',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        CreateArticuloDto: {
          type: 'object',
          required: ['codigo', 'descripcion', 'precio'],
          properties: {
            codigo: {
              type: 'string',
              example: 'ART001'
            },
            descripcion: {
              type: 'string',
              example: 'Laptop Dell Inspiron 15'
            },
            cantidad: {
              type: 'number',
              format: 'float',
              example: 10
            },
            precio: {
              type: 'number',
              format: 'float',
              example: 599.99
            },
            marca: {
              type: 'string',
              example: 'Dell'
            },
            clase: {
              type: 'string',
              example: 'Electrónica'
            }
          }
        },

        // ============================================
        // CLIENTES
        // ============================================
        Cliente: {
          type: 'object',
          required: ['codigo', 'nombre'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del cliente',
              example: 1
            },
            codigo: {
              type: 'string',
              description: 'Código único del cliente',
              example: 'CLI001'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del cliente',
              example: 'Juan Pérez'
            },
            direccion: {
              type: 'string',
              nullable: true,
              description: 'Dirección del cliente',
              example: 'Av. Principal 123'
            },
            telefono: {
              type: 'string',
              nullable: true,
              description: 'Teléfono del cliente',
              example: '+1234567890'
            },
            email: {
              type: 'string',
              nullable: true,
              description: 'Email del cliente',
              example: 'juan@example.com'
            },
            vendedorId: {
              type: 'string',
              description: 'Código del vendedor asignado',
              example: 'VEND001'
            },
            empresaId: {
              type: 'integer',
              description: 'ID de la empresa',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CreateClienteDto: {
          type: 'object',
          required: ['codigo', 'nombre'],
          properties: {
            codigo: {
              type: 'string',
              example: 'CLI001'
            },
            nombre: {
              type: 'string',
              example: 'Juan Pérez'
            },
            direccion: {
              type: 'string',
              example: 'Av. Principal 123'
            },
            telefono: {
              type: 'string',
              example: '+1234567890'
            },
            email: {
              type: 'string',
              example: 'juan@example.com'
            },
            vendedorId: {
              type: 'string',
              example: 'VEND001'
            }
          }
        },

        // ============================================
        // PEDIDOS
        // ============================================
        Pedido: {
          type: 'object',
          required: ['numero', 'articuloCodigo', 'cantidad', 'precioVenta', 'clienteCodigo'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del pedido',
              example: 1
            },
            numero: {
              type: 'string',
              description: 'Número único del pedido',
              example: 'PED-2024-001'
            },
            articuloCodigo: {
              type: 'string',
              description: 'Código del artículo',
              example: 'ART001'
            },
            cantidad: {
              type: 'number',
              format: 'float',
              description: 'Cantidad solicitada',
              example: 2
            },
            precioVenta: {
              type: 'number',
              format: 'float',
              description: 'Precio de venta unitario',
              example: 599.99
            },
            clienteCodigo: {
              type: 'string',
              description: 'Código del cliente',
              example: 'CLI001'
            },
            estado: {
              type: 'integer',
              enum: [1, 2, 3],
              description: '1: Pendiente, 2: Procesado, 3: Anulado',
              example: 1
            },
            fecha: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha del pedido'
            },
            usuario: {
              type: 'string',
              description: 'Usuario que creó el pedido',
              example: 'VEND001'
            },
            indice: {
              type: 'integer',
              description: 'Índice del pedido',
              example: 1
            },
            empresaId: {
              type: 'integer',
              description: 'ID de la empresa',
              example: 1
            },
            // Relaciones pobladas
            cliente: {
              type: 'object',
              properties: {
                nombre: { type: 'string' },
                telefono: { type: 'string' },
                email: { type: 'string' }
              }
            },
            articulo: {
              type: 'object',
              properties: {
                descripcion: { type: 'string' },
                imagen: { type: 'string' }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CreatePedidoDto: {
          type: 'object',
          required: ['numero', 'articuloCodigo', 'cantidad', 'precioVenta', 'clienteCodigo'],
          properties: {
            numero: {
              type: 'string',
              example: 'PED-2024-001'
            },
            articuloCodigo: {
              type: 'string',
              example: 'ART001'
            },
            cantidad: {
              type: 'number',
              format: 'float',
              example: 2
            },
            precioVenta: {
              type: 'number',
              format: 'float',
              example: 599.99
            },
            clienteCodigo: {
              type: 'string',
              example: 'CLI001'
            },
            estado: {
              type: 'integer',
              enum: [1, 2, 3],
              example: 1
            },
            usuario: {
              type: 'string',
              example: 'VEND001'
            }
          }
        },

        // ============================================
        // CUENTAS POR COBRAR (CXC)
        // ============================================
        Cxcobrar: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la cuenta',
              example: 1
            },
            tipoDocumento: {
              type: 'string',
              description: 'Tipo de documento',
              example: 'Factura'
            },
            numero: {
              type: 'integer',
              description: 'Número del documento',
              example: 1001
            },
            saldo: {
              type: 'number',
              format: 'float',
              description: 'Saldo pendiente',
              example: 1500.50
            },
            monto: {
              type: 'number',
              format: 'float',
              description: 'Monto total',
              example: 2000.00
            },
            clienteCodigo: {
              type: 'string',
              description: 'Código del cliente',
              example: 'CLI001'
            },
            fecha: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha del documento'
            },
            fechaVencimiento: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de vencimiento'
            },
            empresaId: {
              type: 'integer',
              description: 'ID de la empresa',
              example: 1
            },
            // Relación poblada
            cliente: {
              type: 'object',
              properties: {
                nombre: { type: 'string' },
                telefono: { type: 'string' }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },

        // ============================================
        // EMPRESAS
        // ============================================
        Empresa: {
          type: 'object',
          required: ['nombre'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la empresa',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la empresa',
              example: 'Mi Empresa S.A.'
            },
            ruc: {
              type: 'string',
              nullable: true,
              description: 'RUC o identificación fiscal',
              example: '1234567890001'
            },
            direccion: {
              type: 'string',
              nullable: true,
              description: 'Dirección de la empresa',
              example: 'Av. Principal 456'
            },
            telefono: {
              type: 'string',
              nullable: true,
              description: 'Teléfono de la empresa',
              example: '+1234567890'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },

        // ============================================
        // VENDEDORES
        // ============================================
        Vendedor: {
          type: 'object',
          required: ['codigo', 'nombre'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del vendedor',
              example: 1
            },
            codigo: {
              type: 'string',
              description: 'Código único del vendedor',
              example: 'VEND001'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del vendedor',
              example: 'María García'
            },
            rol: {
              type: 'string',
              description: 'Rol del vendedor',
              example: 'vendedor'
            },
            empresaId: {
              type: 'integer',
              description: 'ID de la empresa',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ValidateVendedorDto: {
          type: 'object',
          required: ['codigo', 'companyId'],
          properties: {
            codigo: {
              type: 'string',
              example: 'VEND001'
            },
            companyId: {
              type: 'integer',
              example: 1
            }
          }
        },

        // ============================================
        // SINCRONIZACIÓN
        // ============================================
        SyncLog: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            entity: {
              type: 'string',
              description: 'Entidad sincronizada',
              example: 'pedidos'
            },
            operation: {
              type: 'string',
              enum: ['create', 'update', 'delete'],
              description: 'Operación realizada',
              example: 'create'
            },
            entityId: {
              type: 'string',
              description: 'ID de la entidad',
              example: '123'
            },
            deviceId: {
              type: 'string',
              description: 'ID del dispositivo',
              example: 'device-abc-123'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp de la sincronización'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },

        // ============================================
        // RESPUESTAS COMUNES
        // ============================================
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Error al procesar la solicitud'
            },
            message: {
              type: 'string',
              description: 'Descripción detallada del error',
              example: 'El código del artículo ya existe'
            },
            statusCode: {
              type: 'integer',
              description: 'Código de estado HTTP',
              example: 400
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de éxito',
              example: 'Operación completada exitosamente'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta'
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Solicitud incorrecta',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [
      {
        CompanyHeader: [],
        SalespersonHeader: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'] // Ruta a los archivos de rutas con anotaciones Swagger
};

const specs = swaggerJsdoc(options);

export default specs;