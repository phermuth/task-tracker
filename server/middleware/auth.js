// 🔐 Middleware para autenticación con JWT
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Middleware para verificar token JWT
const auth = (req, res, next) => {
  try {
    // Obtener token del header 'Authorization'
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '🔒 Acceso denegado. Token no proporcionado o formato incorrecto.'
      });
    }
    
    // Extraer token (quitar 'Bearer ')
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '🔒 Acceso denegado. Token no proporcionado.'
      });
    }
    
    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Agregar la información del usuario al request
      req.user = decoded;
      
      // Continuar con la siguiente función
      next();
    } catch (error) {
      console.error('❌ Error al verificar token:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: '🕒 El token ha expirado. Inicia sesión nuevamente.'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: '🔒 Token inválido.'
      });
    }
  } catch (error) {
    console.error('❌ Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error interno del servidor.'
    });
  }
};

module.exports = auth;