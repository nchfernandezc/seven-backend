require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('Checking tables...');
    return client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name', ['public']);
  })
  .then(res => {
    console.log('Tables in database:');
    res.rows.forEach(row => console.log('- ' + row.table_name));
    
    console.log('\nChecking vendedores table structure...');
    return client.query('SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position', ['vendedores']);
  })
  .then(res => {
    console.log('vendedores table columns:');
    res.rows.forEach(row => console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable})`));
  })
  .catch(err => {
    console.error('Error:', err.message);
  })
  .finally(() => {
    client.end();
  });
