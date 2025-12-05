import { DataSource } from "typeorm";
import { config } from "dotenv";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

// Load environment variables
config();

// PostgreSQL configuration for Render
const postgresConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + "/../entities/*.{js,ts}"],
  synchronize: process.env.NODE_ENV !== 'production' || process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? { 
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

// Create the DataSource instance
export const AppDataSource = new DataSource(postgresConfig);

// Function to initialize the database connection
export const initializeDatabase = async () => {
  console.log('🔍 Database Configuration:');
  console.log(`📡 Host: ${postgresConfig.host}`);
  console.log(`📊 Database: ${postgresConfig.database}`);
  console.log(`🔄 Synchronize: ${postgresConfig.synchronize}`);
  console.log(`📝 Logging: ${postgresConfig.logging}`);
  
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Successfully connected to the database');
      console.log('🔗 Connection established successfully');
    } else {
      console.log('ℹ️ Database connection already established');
    }
    return AppDataSource;
  } catch (error) {
    console.error('❌ Database connection error:');
    
    if (error instanceof Error) {
      console.error('📌 Message:', error.message);
      
      // Show only the first few lines of the stack trace
      if (error.stack) {
        const stackLines = error.stack.split('\n');
        console.error('🔍 Stack:', stackLines.slice(0, 5).join('\n'));
      }
    } else {
      console.error('Unknown error:', error);
    }
    
    // Add troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Verify your database credentials in .env');
    console.log('2. Check if the database server is running and accessible');
    console.log('3. Ensure your IP is whitelisted in Render database settings');
    console.log('4. Check if the database exists and the user has proper permissions');
    
    throw error; // Re-throw to be handled by the caller
  }
};

// Export the DataSource and initialize function
export default {
  AppDataSource,
  initializeDatabase
};