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
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connection established successfully!");
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("Error during database connection:", error);
});
