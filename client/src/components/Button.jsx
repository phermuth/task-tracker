// 🔘 Componente de botón reutilizable
import React from 'react';

/**
 * Componente de botón personalizable
 * @param {string} variant - Variante del botón (primary, secondary, danger, outline)
 * @param {string} size - Tamaño del botón (sm, md, lg)
 * @param {boolean} fullWidth - Si el botón debe ocupar todo el ancho disponible
 * @param {boolean} disabled - Si el botón está deshabilitado
 * @param {function} onClick - Función a ejecutar al hacer clic
 * @param {node} children - Contenido del botón
 * @param {string} type - Tipo de botón (button, submit, reset)
 * @param {string} className - Clases personalizadas adicionales
 * @returns {JSX.Element} - Componente de botón
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
  ...props
}) => {
  // Mapear variantes a clases de Tailwind
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
    info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
  };

  // Mapear tamaños a clases de Tailwind
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  // Construir clase final
  const buttonClasses = `
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors duration-200 ease-in-out
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;