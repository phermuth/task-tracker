// 📝 Controlador para tareas
const { validationResult } = require('express-validator');
const taskModel = require('../models/taskModel');

// 📋 Obtener todas las tareas del usuario
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Extraer filtros de la consulta
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      category_id: req.query.category_id
    };
    
    // Obtener tareas
    const tasks = await taskModel.getAll(userId, filters);
    
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    console.error('❌ Error al obtener tareas:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al obtener tareas.'
    });
  }
};

// 🔍 Obtener una tarea específica
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    
    // Buscar tarea
    const task = await taskModel.getById(taskId, userId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: '❌ Tarea no encontrada.'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('❌ Error al obtener tarea:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al obtener la tarea.'
    });
  }
};

// ➕ Crear una nueva tarea
exports.createTask = async (req, res) => {
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
    
    // Preparar datos de la tarea
    const taskData = {
      ...req.body,
      user_id: userId
    };
    
    // Crear tarea
    const newTask = await taskModel.create(taskData);
    
    return res.status(201).json({
      success: true,
      message: '✅ Tarea creada correctamente',
      data: { task: newTask }
    });
  } catch (error) {
    console.error('❌ Error al crear tarea:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al crear la tarea.'
    });
  }
};

// 🔄 Actualizar una tarea
exports.updateTask = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const taskId = req.params.id;
    const userId = req.user.id;
    
    // Actualizar tarea
    const updatedTask = await taskModel.update(taskId, userId, req.body);
    
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: '❌ Tarea no encontrada o no tienes permiso para editarla.'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: '✅ Tarea actualizada correctamente',
      data: { task: updatedTask }
    });
  } catch (error) {
    console.error('❌ Error al actualizar tarea:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '❌ Error al actualizar la tarea.'
    });
  }
};

// ❌ Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    
    // Eliminar tarea
    const deleted = await taskModel.delete(taskId, userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: '❌ Tarea no encontrada o no tienes permiso para eliminarla.'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: '✅ Tarea eliminada correctamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar tarea:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '❌ Error al eliminar la tarea.'
    });
  }
};

// 📊 Obtener estadísticas de tareas
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener estadísticas
    const stats = await taskModel.getStats(userId);
    
    return res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    return res.status(500).json({
      success: false,
      message: '❌ Error al obtener estadísticas de tareas.'
    });
  }
};