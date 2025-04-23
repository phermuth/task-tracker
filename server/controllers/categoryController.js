// 🏷️ Controlador para categorías
const { validationResult } = require('express-validator');
const categoryModel = require('../models/categoryModel');

// 📋 Obtener todas las categorías del usuario
exports.getAllCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener categorías
    const categories = await categoryModel.getAll(userId);
    
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: { categories }
    });
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al obtener categorías.'
    });
  }
};

// 🔍 Obtener una categoría específica
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.id;
    
    // Buscar categoría
    const category = await categoryModel.getById(categoryId, userId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '❌ Categoría no encontrada.'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('❌ Error al obtener categoría:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al obtener la categoría.'
    });
  }
};

// ➕ Crear una nueva categoría
exports.createCategory = async (req, res) => {
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
    
    // Preparar datos de la categoría
    const categoryData = {
      ...req.body,
      user_id: userId
    };
    
    // Crear categoría
    const newCategory = await categoryModel.create(categoryData);
    
    return res.status(201).json({
      success: true,
      message: '✅ Categoría creada correctamente',
      data: { category: newCategory }
    });
  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '❌ Error al crear la categoría.'
    });
  }
};

// 🔄 Actualizar una categoría
exports.updateCategory = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const categoryId = req.params.id;
    const userId = req.user.id;
    
    // Actualizar categoría
    const updatedCategory = await categoryModel.update(categoryId, userId, req.body);
    
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: '❌ Categoría no encontrada o no tienes permiso para editarla.'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: '✅ Categoría actualizada correctamente',
      data: { category: updatedCategory }
    });
  } catch (error) {
    console.error('❌ Error al actualizar categoría:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '❌ Error al actualizar la categoría.'
    });
  }
};

// ❌ Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.id;
    
    // Eliminar categoría
    const deleted = await categoryModel.delete(categoryId, userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: '❌ Categoría no encontrada o no tienes permiso para eliminarla.'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: '✅ Categoría eliminada correctamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '❌ Error al eliminar la categoría.'
    });
  }
};