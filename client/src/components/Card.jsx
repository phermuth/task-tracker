// 🃏 Componente de tarjeta reutilizable
import React from 'react';

/**
 * Componente de tarjeta para mostrar contenido
 * @param {node} children - Contenido de la tarjeta
 * @param {string} title - Título de la tarjeta
 * @param {node} icon - Icono para mostrar junto al título
 * @param {node} actions - Acciones (botones, etc.) para mostrar en la tarjeta
 * @param {string} className - Clases personalizadas adicionales
 * @param {boolean} hoverable - Si la tarjeta debe tener efecto hover
 * @returns {JSX.Element} - Componente de tarjeta
 */
const Card = ({
  children,
  title,
  icon,
  actions,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        ${hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Encabezado con título e icono (opcional) */}
      {(title || icon) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            {icon && <span className="text-gray-500">{icon}</span>}
            {title && (
              <h3 className="font-medium text-gray-800">{title}</h3>
            )}
          </div>
          
          {/* Acciones opcionales en el encabezado */}
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {/* Contenido principal */}
      <div className={`p-4 ${!title && !icon ? 'pt-4' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;