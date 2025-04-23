// 👤 Modelo para la gestión de usuarios
const { pool } = require('../db/config');
const bcrypt = require('bcrypt');

class UserModel {
  // 📝 Registrar un nuevo usuario
  async create(userData) {
    const { name, email, password } = userData;
    
    try {
      // Encriptar la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insertar usuario en la base de datos
      const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `;
      
      const values = [name, email, hashedPassword];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      throw error;
    }
  }
  
  // 🔍 Buscar usuario por email
  async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error al buscar usuario por email:', error);
      throw error;
    }
  }
  
  // 🔍 Buscar usuario por ID
  async findById(id) {
    try {
      const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('❌ Error al buscar usuario por ID:', error);
      throw error;
    }
  }
  
  // 🔄 Actualizar información del usuario
  async update(id, userData) {
    const { name, email } = userData;
    
    try {
      const query = `
        UPDATE users
        SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, name, email, created_at, updated_at
      `;
      
      const values = [name, email, id];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      throw error;
    }
  }
  
  // 🔐 Cambiar contraseña
  async updatePassword(id, newPassword) {
    try {
      // Encriptar la nueva contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      const query = `
        UPDATE users
        SET password = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      `;
      
      const values = [hashedPassword, id];
      await pool.query(query, values);
      
      return true;
    } catch (error) {
      console.error('❌ Error al actualizar contraseña:', error);
      throw error;
    }
  }
}

module.exports = new UserModel();