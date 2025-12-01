// src/app.ts
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use(routes);

export default app;