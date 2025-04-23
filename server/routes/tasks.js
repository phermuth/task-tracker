// 📝 Rutas para la gestión de tareas
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// 📋 Obtener todas las tareas del usuario
router.get('/', taskController.getAllTasks);

// 📊 Obtener estadísticas de tareas
router.get('/stats', taskController.getTaskStats);

// 🔍 Obtener una tarea específica
router.get('/:id', taskController.getTaskById);

// ➕ Crear una nueva tarea
router.post(
  '/',
  [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
    check('priority').optional().isIn(['low', 'medium', 'high']),
    check('due_date').optional().isISO8601().withMessage('Fecha de vencimiento no válida')
  ],
  taskController.createTask
);

// 🔄 Actualizar una tarea
router.put(
  '/:id',
  [
    check('title').optional().not().isEmpty().withMessage('El título no puede estar vacío'),
    check('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
    check('priority').optional().isIn(['low', 'medium', 'high']),
    check('due_date').optional().isISO8601().withMessage('Fecha de vencimiento no válida')
  ],
  taskController.updateTask
);

// ❌ Eliminar una tarea
router.delete('/:id', taskController.deleteTask);

module.exports = router;