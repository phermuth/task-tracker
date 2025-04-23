// 🔐 Contexto de autenticación
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Estado para el usuario actual
  const [currentUser, setCurrentUser] = useState(null);
  // Estado para saber si se está cargando
  const [loading, setLoading] = useState(true);
  // Estado para saber si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Efecto para verificar si hay una sesión activa al cargar la página
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Obtener información del usuario
          const response = await authService.getProfile();
          setCurrentUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('❌ Error al verificar sesión:', error);
          // Limpiar datos de sesión si hay error
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      
      toast.success('✅ Sesión iniciada correctamente');
      return response;
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      const errorMessage = 
        error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(`❌ ${errorMessage}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar usuario
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      
      toast.success('✅ Usuario registrado correctamente');
      return response;
    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);
      const errorMessage = 
        error.response?.data?.message || 'Error al registrar usuario';
      toast.error(`❌ ${errorMessage}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.info('👋 Sesión cerrada correctamente');
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(profileData);
      
      // Actualizar datos del usuario
      setCurrentUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('✅ Perfil actualizado correctamente');
      return response;
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      const errorMessage = 
        error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(`❌ ${errorMessage}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await authService.changePassword(passwordData);
      
      toast.success('✅ Contraseña actualizada correctamente');
      return response;
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      const errorMessage = 
        error.response?.data?.message || 'Error al cambiar contraseña';
      toast.error(`❌ ${errorMessage}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    currentUser,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;