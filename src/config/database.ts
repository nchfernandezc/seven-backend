import { DataSource } from "typeorm";
import { config } from "dotenv";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

// Load environment variables
config();

// Determinar qué configuración usar basada en el entorno
const isProduction = process.env.NODE_ENV === 'production';
const usePostgres = isProduction || process.env.DB_TYPE === 'postgres';

// Configuración para PostgreSQL (Producción)
const postgresConfig: PostgresConnectionOptions = {
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
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'sistema_local',
  entities: [__dirname + "/../entities/*.{js,ts}"],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  extra: {
    connectionLimit: 5,
    acquireTimeout: 10000,
    timeout: 10000,
  }
};

// Seleccionar la configuración apropiada
const databaseConfig = usePostgres ? postgresConfig : mysqlConfig;

// Create the DataSource instance
export const AppDataSource = new DataSource(databaseConfig);

// Function to initialize the database connection
// Función para inicializar la conexión a la base de datos
export const initializeDatabase = async () => {
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
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log(`✅ Successfully connected to ${dbType} database`);
      console.log('🔗 Connection established successfully');
    } else {
      console.log('ℹ️ Database connection already established');
    }
    return AppDataSource;
  } catch (error) {
    console.error(`❌ ${dbType} connection error:`);
    
    if (error instanceof Error) {
      console.error('📌 Message:', error.message);
      
      // Mostrar solo las primeras líneas del stack trace
      if (error.stack) {
        const stackLines = error.stack.split('\n');
        console.error('🔍 Stack:', stackLines.slice(0, 5).join('\n'));
      }
    } else {
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

// Export the DataSource and initialize function
export default {
  AppDataSource,
  initializeDatabase
};