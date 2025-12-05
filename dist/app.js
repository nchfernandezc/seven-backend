"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const extractHeaders_1 = require("./middleware/extractHeaders");
const app = (0, express_1.default)();
// Configuración de CORS
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-company-id', 'x-salesperson-id']
}));
// Middleware para extraer headers
app.use(extractHeaders_1.extractHeaders);
app.use(express_1.default.json());
// Rutas de la API
app.use('/', routes_1.default);
// Configuración de Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Documentación de la API',
    swaggerOptions: {
        persistAuthorization: true,
        // Asegúrate de que la URL base sea correcta
        url: 'http://localhost:3000/api-docs-json' // Añade esta línea
    }
}));
// Ruta para el archivo JSON de Swagger
app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.default);
});
exports.default = app;
