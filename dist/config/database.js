"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'sistema',
    synchronize: true,
    logging: process.env.DB_LOGGING === 'true',
    entities: [__dirname + "/../entities/*.{js,ts}"],
    // migrations: ['src/migrations/*.ts'],
    // subscribers: ['src/subscribers/*.ts'],
});
