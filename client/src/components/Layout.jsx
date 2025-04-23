// 🏗️ Componente de layout principal de la aplicación
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

/**
 * Layout principal de la aplicación
 * @returns {JSX.Element} - Componente de layout
 */
const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación superior */}
      <Navbar />
      
      {/* Contenido principal */}
      <div className="flex">
        {/* Barra lateral (solo visible si está autenticado) */}
        {isAuthenticated && (
          <Sidebar 
            initialCollapsed={sidebarCollapsed} 
            onCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
          />
        )}
        
        {/* Contenido de la página */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out pt-16 min-h-screen ${
            isAuthenticated ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Aquí se renderiza el contenido de la ruta actual */}
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Contenedor para notificaciones toast */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Layout;