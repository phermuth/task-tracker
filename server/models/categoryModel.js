// 🏷️ Modelo para la gestión de categorías
const { pool } = require('../db/config');

class CategoryModel {
  // 📊 Obtener todas las categorías de un usuario
  async getAll(userId) {
    try {
      // Obtener categorías predeterminadas y las del usuario
      const query = `
        SELECT c.*, 
               (SELECT COUNT(*) FROM tasks t WHERE t.category_id = c.id AND t.user_id = $1) as task_count
        FROM categories c
        WHERE c.user_id IS NULL OR c.user_id = $1
        ORDER BY c.name ASC
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      throw error;
    }
  }
  
  // 🔍 Obtener una categoría por ID
  async getById(id, userId) {
    try {
      // Obtener categoría predeterminada o del usuario
      const query = `
        SELECT * FROM categories
        WHERE id = $1 AND (user_id IS NULL OR user_id = $2)
      `;
      
      const result = await pool.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error al obtener categoría por ID:', error);
      throw error;
    }
  }
  
  // ➕ Crear una nueva categoría
  async create(categoryData) {
    const { name, color, icon, user_id } = categoryData;
    
    try {
      // Verificar si ya existe una categoría con el mismo nombre para este usuario
      const existingQuery = `
        SELECT * FROM categories
        WHERE name = $1 AND (user_id IS NULL OR user_id = $2)
      `;
      
      const existingResult = await pool.query(existingQuery, [name, user_id]);
      
      if (existingResult.rowCount > 0) {
        throw new Error('Ya existe una categoría con ese nombre');
      }
      
      // Insertar nueva categoría
      const query = `
        INSERT INTO categories (name, color, icon, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const values = [
        name,
        color || '#3498db', // Color por defecto
        icon || null,
        user_id
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error al crear categoría:', error);
      throw error;
    }
  }
  
  // 🔄 Actualizar una categoría
  async update(id, userId, categoryData) {
    const { name, color, icon } = categoryData;
    
    try {
      // Verificar que la categoría pertenece al usuario y no es predeterminada
      const categoryCheck = await this.getById(id, userId);
      
      if (!categoryCheck) {
        throw new Error('Categoría no encontrada');
      }
      
      if (categoryCheck.user_id === null) {
        throw new Error('No se pueden modificar las categorías predeterminadas');
      }
      
      // Verificar que no hay otra categoría con el mismo nombre
      if (name && name !== categoryCheck.name) {
        const existingQuery = `
          SELECT * FROM categories
          WHERE name = $1 AND (user_id IS NULL OR user_id = $2) AND id != $3
        `;
        
        const existingResult = await pool.query(existingQuery, [name, userId, id]);
        
        if (existingResult.rowCount > 0) {
          throw new Error('Ya existe otra categoría con ese nombre');
        }
      }
      
      // Actualizar categoría
      const query = `
        UPDATE categories
        SET name = $1, color = $2, icon = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4 AND user_id = $5
        RETURNING *
      `;
      
      const values = [
        name || categoryCheck.name,
        color || categoryCheck.color,
        icon !== undefined ? icon : categoryCheck.icon,
        id,
        userId
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error al actualizar categoría:', error);
      throw error;
    }
  }
  
  // ❌ Eliminar una categoría
  async delete(id, userId) {
    try {
      // Verificar que la categoría pertenece al usuario y no es predeterminada
      const categoryCheck = await this.getById(id, userId);
      
      if (!categoryCheck) {
        throw new Error('Categoría no encontrada');
      }
      
      if (categoryCheck.user_id === null) {
        throw new Error('No se pueden eliminar las categorías predeterminadas');
      }
      
      // Eliminar categoría
      const query = 'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id';
      const result = await pool.query(query, [id, userId]);
      
      return result.rowCount > 0;
    } catch (error) {
      console.error('❌ Error al eliminar categoría:', error);
      throw error;
    }
  }
}

module.exports = new CategoryModel();