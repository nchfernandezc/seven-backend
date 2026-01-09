import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { initializeDatabase } from './config/database';
import app from './app';

const PORT = process.env.PORT || 3000;

// Inicializar la conexión a la base de datos y luego iniciar el servidor
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en:`);
      console.log(`   - Local:   http://localhost:${PORT}`);

      const { networkInterfaces } = require('os');
      const nets = networkInterfaces();
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
            console.log(`   - Red:     http://${net.address}:${PORT}`);
          }
        }
      }
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();