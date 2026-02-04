const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USERNAME || 'root',
            database: process.env.DB_DATABASE || 'seven7s_db01',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });

        console.log('Connected to database as ID: ' + connection.threadId);

        const matchId = 71;
        const tableName = '071_cxc'; // Direct table name

        console.log(`Querying ${tableName}...`);
        const [rows, fields] = await connection.execute(`SELECT * FROM \`${tableName}\` LIMIT 5`);

        console.log('Columns:', fields.map(f => f.name).join(', '));
        console.log('Data:', JSON.stringify(rows, null, 2));

        await connection.end();
        console.log('Connection closed.');
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
