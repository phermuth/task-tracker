// 📝 Modelo para la gestión de tareas
const { pool } = require('../db/config');

class TaskModel {
  // 📊 Obtener todas las tareas de un usuario
  async getAll(userId, filters = {}) {
    try {
      let query = `
        SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = $1
      `;
      
      const queryParams = [userId];
      let paramCounter = 2;
      
      // Aplicar filtros si existen
      if (filters.status) {
        query += ` AND t.status = $${paramCounter}`;
        queryParams.push(filters.status);
        paramCounter++;
      }
      
      if (filters.priority) {
        query += ` AND t.priority = $${paramCounter}`;
        queryParams.push(filters.priority);
        paramCounter++;
      }
      
      if (filters.category_id) {
        query += ` AND t.category_id = $${paramCounter}`;
        queryParams.push(filters.category_id);
        paramCounter++;
      }
      
      // Ordenar por fecha de creación (más recientes primero)
      query += ' ORDER BY t.created_at DESC';
      
      const result = await pool.query(query, queryParams);
      return result.rows;
    } catch (error) {
      console.error('❌ Error al obtener tareas:', error);
      throw error;
    }
  }
  
  // 🔍 Obtener una tarea por ID
  async getById(id, userId) {
    try {
      const query = `
        SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = $1 AND t.user_id = $2
      `;
      
      const result = await pool.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error al obtener tarea por ID:', error);
      throw error;
    }
  }
  
  // ➕ Crear una nueva tarea
  async create(taskData) {
    const { title, description, status, priority, due_date, user_id, category_id } = taskData;
    
    try {
      const query = `
        INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [
        title,
        description || null,
        status || 'pending',
        priority || 'medium',
        due_date || null,
        user_id,
        category_id || null
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error al crear tarea:', error);
      throw error;
    }
  }
  
  // 🔄 Actualizar una tarea
  async update(id, userId, taskData) {
    const { title, description, status, priority, due_date, category_id } = taskData;
    
    try {
      // Verificar primero que la tarea pertenece al usuario
      const taskCheck = await this.getById(id, userId);
      if (!taskCheck) {
        throw new Error('Tarea no encontrada o no tienes permiso para editarla');
      }
      
      const query = `
        UPDATE tasks
        SET title = $1, description = $2, status = $3, priority = $4, 
            due_date = $5, category_id = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7 AND user_id = $8
        RETURNING *
      `;
      
      const values = [
        title || taskCheck.title,
        description !== undefined ? description : taskCheck.description,
        status || taskCheck.status,
        priority || taskCheck.priority,
        due_date !== undefined ? due_date : taskCheck.due_date,
        category_id !== undefined ? category_id : taskCheck.category_id,
        id,
        userId
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error al actualizar tarea:', error);
      throw error;
    }
  }
  
  // ❌ Eliminar una tarea
  async delete(id, userId) {
    try {
      // Verificar primero que la tarea pertenece al usuario
      const taskCheck = await this.getById(id, userId);
      if (!taskCheck) {
        throw new Error('Tarea no encontrada o no tienes permiso para eliminarla');
      }
      
      const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id';
      const result = await pool.query(query, [id, userId]);
      
      return result.rowCount > 0;
    } catch (error) {
      console.error('❌ Error al eliminar tarea:', error);
      throw error;
    }
  }
  
  // 📊 Obtener estadísticas de tareas para un usuario
  async getStats(userId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_tasks,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
          SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority_tasks,
          SUM(CASE WHEN due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
        FROM tasks
        WHERE user_id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error al obtener estadísticas de tareas:', error);
      throw error;
    }
  }
}

module.exports = new TaskModel();