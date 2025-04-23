// 📝 Componente de entrada de texto reutilizable
import React, { forwardRef } from 'react';

/**
 * Componente de input personalizable
 * @param {string} type - Tipo de input (text, email, password, etc.)
 * @param {string} id - ID del input
 * @param {string} name - Nombre del input
 * @param {string} label - Etiqueta del input
 * @param {string} placeholder - Placeholder del input
 * @param {boolean} required - Si el input es requerido
 * @param {boolean} disabled - Si el input está deshabilitado
 * @param {string} error - Mensaje de error
 * @param {function} onChange - Función a ejecutar al cambiar el valor
 * @param {function} onBlur - Función a ejecutar al perder el foco
 * @param {string} value - Valor del input
 * @param {string} className - Clases personalizadas adicionales
 * @returns {JSX.Element} - Componente de input
 */
const Input = forwardRef(({
  type = 'text',
  id,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  onChange,
  onBlur,
  value,
  className = '',
  icon,
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          className={`
            w-full px-3 py-2 border rounded-lg
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            transition-colors duration-200
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

// Nombre para DevTools
Input.displayName = 'Input';

export default Input;