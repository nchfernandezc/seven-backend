"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AppDataSource = new typeorm_1.DataSource({
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
        console.log("Columns:", columns.map((c) => c.Field).join(", "));
        console.log(`\n--- Raw Data (First 10 rows) ---`);
        const data = await AppDataSource.query(`SELECT * FROM \`${tableName}\` LIMIT 10`);
        console.log(JSON.stringify(data, null, 2));
        await AppDataSource.destroy();
    }
    catch (error) {
        console.error("Error:", error);
    }
}
debug();
