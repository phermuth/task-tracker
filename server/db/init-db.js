// 🔧 Script para inicializar la base de datos
const fs = require('fs');
const path = require('path');
const { pool } = require('./config');

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    console.log('🗄️ Inicializando base de datos...');
    
    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, 'init.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Ejecutar el script SQL
    await pool.query(sqlScript);
    
    console.log('✅ Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar la función
initializeDatabase();