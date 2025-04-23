// 🗄️ Configuración de la base de datos PostgreSQL
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Crear pool de conexiones
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Exportar pool para usarlo en otros archivos
module.exports = {
  pool,
  // Función de consulta envuelta en una promesa para facilitar su uso
  query: (text, params) => pool.query(text, params),
};

// Mensaje informativo sobre el archivo
console.log('📦 Configuración de base de datos cargada');