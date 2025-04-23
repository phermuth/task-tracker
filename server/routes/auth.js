// 🔐 Rutas de autenticación
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// 📝 Registrar usuario
router.post(
  '/register',
  [
    // Validaciones
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Ingresa un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
  ],
  authController.register
);

// 🔑 Iniciar sesión
router.post(
  '/login',
  [
    check('email', 'Ingresa un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists()
  ],
  authController.login
);

// 👤 Obtener perfil del usuario actual (requiere autenticación)
router.get('/profile', auth, authController.getProfile);

// 🔄 Actualizar perfil (requiere autenticación)
router.put(
  '/profile',
  [
    auth,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Ingresa un email válido').isEmail()
  ],
  authController.updateProfile
);

// 🔐 Cambiar contraseña (requiere autenticación)
router.put(
  '/change-password',
  [
    auth,
    check('currentPassword', 'La contraseña actual es obligatoria').exists(),
    check('newPassword', 'La nueva contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
  ],
  authController.changePassword
);

module.exports = router;