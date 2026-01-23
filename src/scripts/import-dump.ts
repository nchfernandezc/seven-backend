import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config();

async function resetAndImport() {
    const connection = await createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        multipleStatements: true
    });

    console.log('📡 Connected to database...');

    try {
        // 1. Get all tables explicitly
        const [rows]: any = await connection.query(`
          SHOW TABLES;
        `);

        // The key in the object varies (e.g., 'Tables_in_railway'), so we take the first value of each row
        const tables = rows.map((row: any) => Object.values(row)[0]);

        if (tables.length > 0) {
            console.log(`🗑️  Dropping tables: ${tables.join(', ')}`);
            await connection.query('SET FOREIGN_KEY_CHECKS = 0');
            for (const table of tables) {
                await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
            }
            await connection.query('SET FOREIGN_KEY_CHECKS = 1');
            console.log('✅ All tables dropped.');
        } else {
            console.log('ℹ️ No tables to drop.');
        }

        // 2. Read and execute SQL dump
        console.log('📄 Reading seven_backend_dump.sql...');
        const sqlPath = join(process.cwd(), 'seven_backend_dump.sql');
        const sql = readFileSync(sqlPath, 'utf8');

        console.log('🚀 Importing data...');
        // We split by ';' if multipleStatements is not enough, but mysql2 supports multipleStatements
        await connection.query(sql);

        console.log('✅ SQL Dump imported successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await connection.end();
    }
}

resetAndImport();
