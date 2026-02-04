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

        console.log('--- Resumen de Deuda 071_cxc ---');

        // Total rows
        const [total] = await connection.execute('SELECT COUNT(*) as count FROM `071_cxc`');
        console.log('Total de registros en 071_cxc:', total[0].count);

        // Rows with nsal > 0 (Current logic)
        const [debtPos] = await connection.execute("SELECT COUNT(*) as count FROM `071_cxc` WHERE nsal > 0 AND ista = 0 AND cdoc IN ('FAC', 'ENT')");
        console.log('Registros con saldo POSITIVO y FAC/ENT (Logica actual):', debtPos[0].count);

        // Rows with nsal != 0 (Proposed logic)
        const [debtAny] = await connection.execute("SELECT COUNT(*) as count FROM `071_cxc` WHERE nsal != 0 AND ista = 0");
        console.log('Registros con saldo != 0 y Pendientes (Logica propuesta):', debtAny[0].count);

        // Sample of non-zero rows
        const [samples] = await connection.execute("SELECT cdoc, nsal, ista, ccli FROM `071_cxc` WHERE nsal != 0 LIMIT 5");
        console.log('Muestras de saldos no cero:', samples);

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}
run();
