// 🏷️ Rutas para la gestión de categorías
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// 📋 Obtener todas las categorías del usuario
router.get('/', categoryController.getAllCategories);

// 🔍 Obtener una categoría específica
router.get('/:id', categoryController.getCategoryById);

// ➕ Crear una nueva categoría
router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('color').optional().isHexColor().withMessage('El color debe ser un código hexadecimal válido'),
    check('icon').optional()
  ],
  categoryController.createCategory
);

// 🔄 Actualizar una categoría
router.put(
  '/:id',
  [
    check('name').optional().not().isEmpty().withMessage('El nombre no puede estar vacío'),
    check('color').optional().isHexColor().withMessage('El color debe ser un código hexadecimal válido'),
    check('icon').optional()
  ],
  categoryController.updateCategory
);

// ❌ Eliminar una categoría
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;