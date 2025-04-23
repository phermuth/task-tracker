// 🚀 Archivo principal del servidor
// Importar dependencias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./db/config');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 🔄
app.use(cors());
app.use(express.json()); // Para parsear JSON en las peticiones

// Importar rutas
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');
const categoriesRoutes = require('./routes/categories');

// Usar rutas 🛣️
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/categories', categoriesRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('¡API de TaskTracker funcionando! 🎉');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error en el servidor:', err);
  res.status(500).json({
    success: false,
    message: 'Error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

// Verificar conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err);
  } else {
    console.log('✅ Conexión a PostgreSQL exitosa:', res.rows[0].now);
  }
});