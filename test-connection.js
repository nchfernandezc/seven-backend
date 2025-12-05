// Agrega esto al principio del archivo
require('dotenv').config();

const { Client } = require('pg');

// Mostrar las variables de entorno (solo para depuración)
console.log('Variables de entorno cargadas:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  hasPassword: !!process.env.DB_PASSWORD
});

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('✅ Conexión exitosa a PostgreSQL');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('⏱️  Hora actual de la base de datos:', res.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
  })
  .finally(() => {
    client.end();
    console.log('🔌 Conexión cerrada');
  });