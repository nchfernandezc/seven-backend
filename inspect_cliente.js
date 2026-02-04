const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USERNAME || 'root',
            database: process.env.DB_DATABASE || 'seven7s_db01',
            password: process.env.DB_PASSWORD || '',
            port: 3306
        });

        const tableName = '071_cliente';
        console.log(`Querying ${tableName}...`);
        const [rows] = await connection.execute(`SELECT * FROM \`${tableName}\` LIMIT 3`);
        console.log(JSON.stringify(rows, null, 2));

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
run();
