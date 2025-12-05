"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("reflect-metadata");
const database_1 = require("./config/database");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
// Inicializar la conexión a la base de datos y luego iniciar el servidor
const startServer = async () => {
    try {
        await (0, database_1.initializeDatabase)();
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};
startServer();
