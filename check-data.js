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
    return client.query('SELECT COUNT(*) as total FROM vendedores');
  })
  .then(res => {
    console.log('Total vendedores:', res.rows[0].total);
    
    return client.query('SELECT v.id, v.codigo, v.nombre, v.empresa_id, e.nombre as empresa_nombre FROM vendedores v LEFT JOIN empresas e ON v.empresa_id = e.id LIMIT 5');
  })
  .then(res => {
    console.log('Sample vendedores:');
    res.rows.forEach(row => console.log(`ID: ${row.id}, Código: ${row.codigo}, Nombre: ${row.nombre}, Empresa ID: ${row.empresa_id}, Empresa: ${row.empresa_nombre}`));
    
    return client.query('SELECT COUNT(*) as total FROM empresas');
  })
  .then(res => {
    console.log('Total empresas:', res.rows[0].total);
    
    return client.query('SELECT id, nombre, identificacion FROM empresas LIMIT 3');
  })
  .then(res => {
    console.log('Sample empresas:');
    res.rows.forEach(row => console.log(`ID: ${row.id}, Nombre: ${row.nombre}, Identificación: ${row.identificacion}`));
  })
  .catch(err => {
    console.error('Error:', err.message);
  })
  .finally(() => {
    client.end();
  });
