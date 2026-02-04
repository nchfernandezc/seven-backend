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

        const [rows] = await connection.execute('SELECT * FROM `071_cxc` LIMIT 10');
        console.log(JSON.stringify(rows, null, 2));
        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
run();
