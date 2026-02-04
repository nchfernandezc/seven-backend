import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'seven7s_db01',
    connectorPackage: 'mysql2',
});

async function debug() {
    try {
        await AppDataSource.initialize();
        console.log("Connected to", process.env.DB_DATABASE);

        const tableName = "071_cxc";

        console.log(`\n--- Inspecting Table: ${tableName} ---`);
        const columns = await AppDataSource.query(`SHOW COLUMNS FROM \`${tableName}\``);
        console.log("Columns:", columns.map((c: any) => c.Field).join(", "));

        console.log(`\n--- Raw Data (First 10 rows) ---`);
        const data = await AppDataSource.query(`SELECT * FROM \`${tableName}\` LIMIT 10`);
        console.log(JSON.stringify(data, null, 2));

        await AppDataSource.destroy();
    } catch (error) {
        console.error("Error:", error);
    }
}

debug();
