"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
// Cargar variables de entorno
(0, dotenv_1.config)();
const isProduction = process.env.NODE_ENV === 'production';
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'seven_db',
    entities: [__dirname + "/../entities/*.{js,ts}"],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    connectorPackage: 'mysql2',
    legacySpatialSupport: false,
    extra: isProduction ? {
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 60000,
    } : {}
});
/**
 * Inicializa la conexión a la base de datos MySQL
 */
const initializeDatabase = async () => {
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            console.log(`✅ Base de datos conectada: ${process.env.DB_DATABASE || 'seven_db'}`);
        }
        return exports.AppDataSource;
    }
    catch (error) {
        console.error('❌ Error de conexión a la base de datos:');
        if (error instanceof Error) {
            console.error('📌 Mensaje:', error.message);
        }
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
exports.default = {
    AppDataSource: exports.AppDataSource,
    initializeDatabase: exports.initializeDatabase
};
