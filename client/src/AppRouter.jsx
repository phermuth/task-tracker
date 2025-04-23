// 🛣️ Configuración de rutas de la aplicación
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Páginas públicas
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Páginas protegidas
import DashboardPage from './pages/dashboard/DashboardPage';
import TasksPage from './pages/tasks/TasksPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import TaskFormPage from './pages/tasks/TaskFormPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import ProfilePage from './pages/profile/ProfilePage';

// Layout
import Layout from './components/Layout';

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Renderizar el contenido si está autenticado
  return children;
};

// Componente para rutas públicas (redirige a dashboard si ya está autenticado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Redirigir al dashboard si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  // Renderizar el contenido si no está autenticado
  return children;
};

/**
 * Configuración principal de rutas de la aplicación
 * @returns {JSX.Element} - Componente de rutas
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route path="/" element={<Layout />}>
        {/* Página de inicio (pública) */}
        <Route index element={<HomePage />} />
        
        {/* Rutas de autenticación (públicas) */}
        <Route 
          path="login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        
        {/* Rutas protegidas (requieren autenticación) */}
        <Route 
          path="dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        
        {/* Rutas de tareas */}
        <Route 
          path="tasks" 
          element={
            <PrivateRoute>
              <TasksPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="tasks/new" 
          element={
            <PrivateRoute>
              <TaskFormPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="tasks/:id" 
          element={
            <PrivateRoute>
              <TaskDetailPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="tasks/:id/edit" 
          element={
            <PrivateRoute>
              <TaskFormPage />
            </PrivateRoute>
          } 
        />
        
        {/* Rutas de categorías */}
        <Route 
          path="categories" 
          element={
            <PrivateRoute>
              <CategoriesPage />
            </PrivateRoute>
          } 
        />
        
        {/* Ruta de perfil */}
        <Route 
          path="profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />
        
        {/* Ruta para cualquier otra URL (404) */}
        <Route 
          path="*" 
          element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-lg text-gray-600 mb-6">Página no encontrada</p>
              <Link to="/" className="btn-primary">
                Volver al inicio
              </Link>
            </div>
          } 
        />
      </Route>
    </Routes>
  );
};

export default AppRouter;