import dotenv from 'dotenv';
dotenv.config(); 

import 'reflect-metadata'; 
import { AppDataSource } from './config/database';
import app from './app';

const PORT = process.env.PORT || 3000;

// Inicializar la conexión a la base de datos y luego iniciar el servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully!");
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database connection:", error);
  });