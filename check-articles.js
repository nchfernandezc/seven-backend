require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkArticles() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT
        });

        console.log('Connected to MySQL database!');
        console.log('Checking articles in database...');

        // Check total count
        const [rows] = await connection.execute('SELECT COUNT(*) as total FROM articulos');
        console.log('Total articles:', rows[0].total);

        // Check articles with matching code (case insensitive check)
        const code = 'art010';
        console.log(`\nSearching for article with code: ${code}`);

        const [searchRes] = await connection.execute(
            'SELECT id, ccod, cdet, empresa_id, npre1 FROM articulos WHERE LOWER(ccod) = LOWER(?)',
            [code]
        );

        if (searchRes.length === 0) {
            console.log('No articles found with that code (case insensitive match).');
        } else {
            console.log('Found matches:');
            searchRes.forEach(row => {
                console.log(JSON.stringify(row));
                console.log(`Exact Match Check: '${row.ccod}' === '${code}' ? ${row.ccod === code}`);
                console.log(`Empresa ID: ${row.empresa_id} (Type: ${typeof row.empresa_id})`);
            });
        }

        // List all articles for empresa 1 to see what's available
        console.log('\nAll articles for Empresa ID 1:');
        const [empresa1Res] = await connection.execute('SELECT id, ccod, cdet, empresa_id FROM articulos WHERE empresa_id = 1 LIMIT 10');
        empresa1Res.forEach(row => console.log(JSON.stringify(row)));

        await connection.end();

    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkArticles();
