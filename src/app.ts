import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger';
import { extractHeaders } from './middleware/extractHeaders';

const app = express();

// Configuración de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-company-id', 'x-salesperson-id', 'id_apk', 'vendedor_apk']
}));

// Logger básico para ver las peticiones
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

// Middleware para extraer headers
app.use(extractHeaders);

// Rutas de la API
app.use('/', routes);

// Manejo de rutas no encontradas (404)
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${_req.originalUrl}`
  });
});

// Manejo de errores globales (500)
const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('[Global Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
app.use(errorHandler);

// Configuración de Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Documentación de la API',
    swaggerOptions: {
      persistAuthorization: true,
      // Asegúrate de que la URL base sea correcta
      url: 'http://localhost:3000/api-docs-json' // Añade esta línea
    }
  })
);

// Ruta para el archivo JSON de Swagger
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

export default app;