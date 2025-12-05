import express from 'express';
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
  allowedHeaders: ['Content-Type', 'Authorization', 'x-company-id', 'x-salesperson-id']
}));

// Middleware para extraer headers
app.use(extractHeaders);

app.use(express.json());

// Rutas de la API
app.use('/', routes);

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