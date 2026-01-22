"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
// Load environment variables
(0, dotenv_1.config)();
// Determinar qué configuración usar basada en el entorno
const isProduction = process.env.NODE_ENV === 'production';
const usePostgres = isProduction || process.env.DB_TYPE === 'postgres';
// Configuración para PostgreSQL (Producción)
const postgresConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + "/../entities/*.{js,ts}"],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: usePostgres ? {
        rejectUnauthorized: false
    } : false,
    extra: {
        // Connection pool settings
        max: 5, // Reduced maximum number of connections
        connectionTimeoutMillis: 10000, // Increased timeout to 10 seconds
        idleTimeoutMillis: 60000, // Increased idle timeout
        statement_timeout: 10000,
        query_timeout: 10000,
    }
};
// Configuración para MySQL (Desarrollo Local)
const mysqlConfig = {
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'sistema_local',
    entities: [__dirname + "/../entities/*.{js,ts}"],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    // Remove 'extra' with invalid timeout options, usually not needed for local dev 
    // or should be structured differently for mysql2.
    connectorPackage: 'mysql2',
    legacySpatialSupport: false, // Fix for some MariaDB/MySQL type issues
};
// Seleccionar la configuración apropiada
const databaseConfig = usePostgres ? postgresConfig : mysqlConfig;
// Create the DataSource instance
exports.AppDataSource = new typeorm_1.DataSource(databaseConfig);
// Function to initialize the database connection
// Función para inicializar la conexión a la base de datos
const initializeDatabase = async () => {
    const currentConfig = usePostgres ? postgresConfig : mysqlConfig;
    const dbType = usePostgres ? 'PostgreSQL' : 'MySQL';
    console.log('🔍 Database Configuration:');
    console.log(`🛢️  Database Type: ${dbType}`);
    console.log(`📡 Host: ${currentConfig.host}`);
    console.log(`📊 Database: ${currentConfig.database}`);
    console.log(`👤 User: ${currentConfig.username}`);
    console.log(`🔄 Synchronize: ${currentConfig.synchronize}`);
    console.log(`📝 Logging: ${currentConfig.logging}`);
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            console.log(`✅ Successfully connected to ${dbType} database`);
            console.log('🔗 Connection established successfully');
        }
        else {
            console.log('ℹ️ Database connection already established');
        }
        return exports.AppDataSource;
    }
    catch (error) {
        console.error(`❌ ${dbType} connection error:`);
        if (error instanceof Error) {
            console.error('📌 Message:', error.message);
            // Mostrar solo las primeras líneas del stack trace
            if (error.stack) {
                const stackLines = error.stack.split('\n');
                console.error('🔍 Stack:', stackLines.slice(0, 5).join('\n'));
            }
        }
        else {
            console.error('Unknown error:', error);
        }
        // Agregar consejos para solucionar problemas
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Verifica las credenciales de la base de datos en .env');
        console.log('2. Verifica si el servidor de base de datos está en ejecución');
        console.log('3. Asegúrate de que la base de datos exista y el usuario tenga permisos');
        console.log('4. Para MySQL: Verifica que el servicio MySQL esté en ejecución');
        console.log('5. Para PostgreSQL: Verifica que el servicio PostgreSQL esté en ejecución');
        throw error; // Re-lanzar para que lo maneje el llamador
    }
};
exports.initializeDatabase = initializeDatabase;
// Export the DataSource and initialize function
exports.default = {
    AppDataSource: exports.AppDataSource,
    initializeDatabase: exports.initializeDatabase
};
