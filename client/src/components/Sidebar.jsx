// 📊 Componente de barra lateral
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Iconos
import { 
  RiDashboardLine, 
  RiTaskLine, 
  RiPriceTag3Line, 
  RiSettings4Line, 
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';

/**
 * Componente de barra lateral para navegación en el panel de administración
 * @param {boolean} initialCollapsed - Si la barra lateral está inicialmente colapsada
 * @returns {JSX.Element} - Componente de barra lateral
 */
const Sidebar = ({ initialCollapsed = false }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Estado para colapsar/expandir la barra lateral
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  
  // Verificar si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Elementos de navegación
  const navigationItems = [
    {
      name: 'Dashboard',
      icon: <RiDashboardLine className="text-xl" />,
      path: '/dashboard',
    },
    {
      name: 'Tareas',
      icon: <RiTaskLine className="text-xl" />,
      path: '/tasks',
    },
    {
      name: 'Categorías',
      icon: <RiPriceTag3Line className="text-xl" />,
      path: '/categories',
    },
    {
      name: 'Ajustes',
      icon: <RiSettings4Line className="text-xl" />,
      path: '/profile',
    }
  ];
  
  // No mostrar barra lateral si el usuario no está logueado
  if (!currentUser) return null;
  
  return (
    <aside 
      className={`
        bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        fixed top-16 left-0 z-10
      `}
    >
      <div className="flex flex-col h-full">
        {/* Botón para colapsar/expandir */}
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
          </button>
        </div>
        
        {/* Elementos de navegación */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Información del usuario en la parte inferior */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;