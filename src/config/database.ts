import { DataSource } from "typeorm";
import { config } from "dotenv";

// Cargar variables de entorno
config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'seven_db',
  entities: [__dirname + "/../entities/*.{js,ts}"],
  synchronize: false, // Forzado a false para proteger producción
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
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log(`✅ Base de datos conectada: ${process.env.DB_DATABASE || 'seven_db'}`);
    }
    return AppDataSource;
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:');
    if (error instanceof Error) {
      console.error('📌 Mensaje:', error.message);
    }
    throw error;
  }
};

export default {
  AppDataSource,
  initializeDatabase
};