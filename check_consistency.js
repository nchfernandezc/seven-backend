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

        console.log('--- Salesperson and Company ID Check 071_cxc ---');

        // Distinct values of cven
        const [vens] = await connection.execute('SELECT DISTINCT cven FROM `071_cxc`');
        console.log('Vendedores encontrados (cven):', vens.map(v => `'${v.cven}'`).join(', '));

        // Rows per salesperson
        const [venCounts] = await connection.execute('SELECT cven, COUNT(*) as count FROM `071_cxc` GROUP BY cven');
        console.log('Conteo por vendedor:', venCounts);

        // Check company ID consistency
        const [ids] = await connection.execute('SELECT DISTINCT id FROM `071_cxc`');
        console.log('Empresas encontradas (id):', ids.map(i => i.id));

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
run();
