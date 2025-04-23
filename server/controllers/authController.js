// 🔐 Controlador para autenticación de usuarios
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

// Duración del token JWT (7 días)
const TOKEN_EXPIRY = '7d';

// 📝 Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;
    
    // Verificar si el email ya está registrado
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '📧 Este correo electrónico ya está registrado.'
      });
    }
    
    // Crear nuevo usuario
    const newUser = await userModel.create({ name, email, password });
    
    // Generar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
    
    // Enviar respuesta con el token
    return res.status(201).json({
      success: true,
      message: '✅ Usuario registrado correctamente',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al registrar usuario.'
    });
  }
};

// 🔑 Iniciar sesión
exports.login = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    
    // Verificar si el usuario existe
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '❌ Credenciales incorrectas.'
      });
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '❌ Credenciales incorrectas.'
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
    
    // Enviar respuesta con el token
    return res.status(200).json({
      success: true,
      message: '✅ Inicio de sesión correcto',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    console.error('❌ Error en inicio de sesión:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al iniciar sesión.'
    });
  }
};

// 👤 Obtener perfil del usuario actual
exports.getProfile = async (req, res) => {
  try {
    // Obtener ID del usuario desde el token JWT
    const userId = req.user.id;
    
    // Buscar usuario en la base de datos
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '❌ Usuario no encontrado.'
      });
    }
    
    // Enviar información del perfil
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al obtener información del perfil.'
    });
  }
};

// 🔄 Actualizar perfil del usuario
exports.updateProfile = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { name, email } = req.body;
    
    // Si se está actualizando el email, verificar que no esté en uso
    if (email) {
      const existingUser = await userModel.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          message: '📧 Este correo electrónico ya está en uso.'
        });
      }
    }
    
    // Actualizar perfil
    const updatedUser = await userModel.update(userId, { name, email });
    
    // Enviar respuesta con el usuario actualizado
    return res.status(200).json({
      success: true,
      message: '✅ Perfil actualizado correctamente',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          updated_at: updatedUser.updated_at
        }
      }
    });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al actualizar perfil.'
    });
  }
};

// 🔐 Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Buscar usuario en la base de datos
    const user = await userModel.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '❌ Usuario no encontrado.'
      });
    }
    
    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '❌ La contraseña actual es incorrecta.'
      });
    }
    
    // Actualizar contraseña
    await userModel.updatePassword(userId, newPassword);
    
    // Enviar respuesta
    return res.status(200).json({
      success: true,
      message: '✅ Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al cambiar contraseña.'
    });
  }
};