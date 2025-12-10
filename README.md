# 🚀 Seven Backend - API REST

**Seven Backend** es una API REST robusta y escalable diseñada para servir como el núcleo de la aplicación móvil de gestión comercial "Seven". Construida con Node.js, Express y TypeORM, ofrece soporte nativo tanto para **MySQL** como **PostgreSQL**.

![Backend Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Express](https://img.shields.io/badge/Express-5.0-green)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-red)
![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20Postgres-orange)

---

## 📋 Tabla de Contenidos

1. [✨ Características](#-características)
2. [🛠️ Tecnologías](#-tecnologías)
3. [📁 Estructura del Proyecto](#-estructura-del-proyecto)
4. [🚀 Instalación y Configuración](#-instalación-y-configuración)
5. [💻 Guía de Desarrollo](#-guía-de-desarrollo)
6. [📡 API Endpoints](#-api-endpoints)
7. [🗄️ Esquema de Base de Datos](#-esquema-de-base-de-datos)
8. [🔐 Autenticación](#-autenticación)
9. [📚 Documentación Swagger](#-documentación-swagger)
10. [🚢 Deployment](#-deployment)

---

## ✨ Características

### Funcionalidades Principales

- **📦 Gestión de Pedidos**
  - CRUD completo de pedidos con validación de stock.
  - Filtros avanzados por estado (Pendiente, Procesado, Anulado), cliente y fechas.
  - Soporte multi-empresa y multi-vendedor.
  - Cálculo automático de totales y precios.

- **📊 Gestión de Inventario**
  - Catálogo detallado de artículos/productos.
  - Búsqueda textual y por código.
  - Control de imágenes y detalles técnicos.
  - Categorización por Marcas y Clases.

- **👥 Gestión de Clientes**
  - Directorio completo de clientes.
  - Búsqueda optimizada por código o nombre.
  - Asociación estricta con vendedores y empresas.
  - Historial de transacciones.

- **💰 Cuentas por Cobrar (CXC)**
  - Estado de cuenta en tiempo real.
  - Filtrado de facturas vencidas y por vencer.
  - Gestión de saldos y abonos.

- **🏢 Multi-Empresa & Seguridad**
  - Aislamiento lógico de datos por `empresaId`.
  - Validación de vendedores mediante credenciales y tokens.
  - Headers personalizados para gestión de sesiones (`x-company-id`, `x-salesperson-id`).

- **🔄 Sincronización (Sync)**
  - Sistema robusto para sincronización offline-first.
  - Logs de cambios (`SyncLog`) para seguimiento de auditoría.
  - Endpoints dedicados para `push` (subida) y `pull` (bajada) de datos.

### Características Técnicas

- ✅ **RESTful API**: Arquitectura limpia y estandarizada.
- ✅ **TypeScript**: Código fuertemente tipado para mayor fiabilidad.
- ✅ **TypeORM**: Abstracción de base de datos potente y migration-ready.
- ✅ **Swagger UI**: Documentación viva y ejecutable.
- ✅ **Hybrid DB Support**: Compatible con MySQL (Local/XAMPP) y PostgreSQL (Producción/Supabase).
- ✅ **Scripts de Diagnóstico**: Herramientas integradas para verificar la salud del sistema.

---

## 🛠️ Tecnologías

### Core
- **[Node.js](https://nodejs.org/)** v18+ - Runtime
- **[Express](https://expressjs.com/)** v5 - Framework Web
- **[TypeScript](https://www.typescriptlang.org/)** v5 - Lenguaje

### Base de Datos
- **[TypeORM](https://typeorm.io/)** v0.3 - ORM
- **MySQL2** & **pg** - Drivers de Base de Datos

### Calidad y Documentación
- **[Swagger](https://swagger.io/)** & **swagger-ui-express** - Documentación
- **class-validator** - Validación de datos entrantes
- **nodemon** & **ts-node** - Herramientas de desarrollo

---

## 📁 Estructura del Proyecto

Organización modular siguiendo las mejores prácticas de arquitectura en capas:

```
seven-backend/
├── src/
│   ├── config/                   # ⚙️ Configuraciones (DB, Swagger, Env)
│   │   ├── database.ts           # Configuración dinámica (PG/MySQL)
│   │   └── swagger.ts            # Definición de OpenAPI
│   │
│   ├── entities/                 # 🗄️ Modelos de Base de Datos (TypeORM)
│   │   ├── BaseModel.ts          # Clase abstracta con ID, timestamps
│   │   ├── Articulo.ts           # Productos
│   │   ├── Cliente.ts            # Clientes
│   │   ├── Cxcobrar.ts           # Cuentas por Cobrar
│   │   ├── Empresa.ts            # Entidad Tenant
│   │   ├── Pedido.ts             # Órdenes de Venta
│   │   ├── SyncLog.ts            # Registro de Sincronización
│   │   └── Vendedor.ts           # Fuerza de Ventas
│   │
│   ├── controllers/              # 🎮 Lógica de Negocio
│   │   ├── articulo.controller.ts
│   │   ├── cliente.controller.ts
│   │   ├── cxc.controller.ts
│   │   ├── pedido.controller.ts
│   │   └── ...
│   │
│   ├── routes/                   # 🛣️ Definición de Endpoints
│   │   ├── index.ts              # Router Principal
│   │   ├── articulo.routes.ts
│   │   └── ...
│   │
│   ├── middleware/               # 🛡️ Interceptores
│   │   └── extractHeaders.ts     # Inyección de contexto (Empresa/Vendedor)
│   │
│   ├── scripts/                  # 📜 Utilitarios de Sistema
│   │   ├── check-system.ts       # Diagnóstico de salud
│   │   └── test-data-setup.sql   # SQL de prueba
│   │
│   ├── types/                    # 🏷️ Definiciones TypeScript Globales
│   └── app.ts                    # Setup de Express
│
├── dist/                         # Código Compilado
├── .env                          # Variables de Entorno
└── package.json
```

---

## 🚀 Instalación y Configuración

### 1. Clonar y Preparar
```bash
git clone <repository-url>
cd seven-backend
npm install
```

### 2. Variables de Entorno
Copia el archivo de ejemplo y configura tus credenciales:
```bash
cp .env.example .env
```

Configuración típica para **MySQL (XAMPP)**:
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=seven_db
```

Configuración para **PostgreSQL**:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secret
DB_DATABASE=seven_db
```

### 3. Ejecución
```bash
# Desarrollo (con recarga automática)
npm run dev

# Verificación de sistema (Check de DB y Tablas)
npm run check

# Cargar datos de prueba (Seeds)
npm run seed
```

---

## 💻 Guía de Desarrollo

### Flujo para agregar una nueva funcionalidad

1. **Crear Entidad (`src/entities/`)**
   ```typescript
   @Entity('nombre_tabla')
   export class NuevaEntidad extends BaseModel {
       @Column()
       nombre: string;
   }
   ```

2. **Crear Controlador (`src/controllers/`)**
   Implementar métodos `get`, `post`, `put`, `delete` usando `AppDataSource.getRepository(NuevaEntidad)`.

3. **Crear Rutas (`src/routes/`)**
   Definir el router de Express y agregar la documentación Swagger:
   ```typescript
   /**
    * @swagger
    * /api/nueva-entidad:
    *   get:
    *     summary: Obtener listado
    * ...
    */
   router.get('/', controller.getAll);
   ```

4. **Registrar Ruta (`src/routes/index.ts`)**
   ```typescript
   router.use('/api/nueva-entidad', nuevaEntidadRoutes);
   ```

---

## 📡 API Endpoints

URL Base: `http://localhost:3000/api`

### Artículos
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/articulos` | Listar todos los artículos (paginado) |
| `GET` | `/articulos/:id` | Detalle de artículo |
| `GET` | `/articulos/search` | Buscar por nombre/código |
| `POST` | `/articulos` | Crear artículo |

### Clientes
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/clientes` | Listar clientes de la empresa |
| `GET` | `/clientes/buscar` | Búsqueda por término |
| `GET` | `/clientes/:id` | Detalle de cliente |

### Pedidos
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/pedidos` | Historial de pedidos |
| `POST` | `/pedidos` | Registrar nuevo pedido |
| `PUT` | `/pedidos/:id` | Actualizar estado de pedido |

### Cuentas por Cobrar (CXC)
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/cuentas-por-cobrar` | Listado general |
| `GET` | `/cuentas-por-cobrar/cliente/:id` | CXC por Cliente específico |

### Sincronización
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/sync/init` | Iniciar sesión de sincronización |
| `POST` | `/sync/push` | Subir cambios locales al servidor |
| `POST` | `/sync/pull` | Descargar novedades al dispositivo |

---

## 🗄️ Esquema de Base de Datos

Resumen de las tablas principales que el ORM generará automáticamente:

#### **articulos**
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK) | Identificador único |
| `codigo` | VARCHAR | SKU o código de barra |
| `descripcion` | VARCHAR | Nombre del producto |
| `precio` | DECIMAL | Precio base |
| `empresaId` | INT | FK a Empresa |

#### **clientes**
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK) | Identificador sistema |
| `codigo` | VARCHAR | Código ERP |
| `nombre` | VARCHAR | Razón Social |
| `vendedorCodigo` | VARCHAR | Vendedor asignado |

#### **pedidos**
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK) | PK |
| `numero` | VARCHAR | Número de orden |
| `estado` | INT | 1: Pendiente, 2: Procesado... |
| `total` | DECIMAL | Monto final |

---

## 🔐 Autenticación

El sistema utiliza un esquema de **Multi-tenancy por Headers**.  
Toda petición protegida debe incluir:

```http
x-company-id: <ID_EMPRESA>
x-salesperson-id: <CODIGO_VENDEDOR>
```

Para validar credenciales iniciales en la app móvil:
`POST /api/vendedores/validate`

---

## 📚 Documentación Swagger

Disponible interactivamente en:
👉 `http://localhost:3000/api-docs`

Desde allí puedes probar todos los endpoints, ver los esquemas JSON de respuesta y los códigos de error posibles.

---

## 🚢 Deployment

### Producción con PM2

1. **Build**: `npm run build`
2. **Setup Env**: Configurar `.env` con `NODE_ENV=production`
3. **Start**:
   ```bash
   pm2 start dist/index.js --name "seven-backend"
   ```

### Docker
```dockerfile
FROM node:18-alpine
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

---

**Seven App Backend** - _Sistemas de Gestión Comercial_
Propiedad Privada. Prohibida su distribución sin autorización.
