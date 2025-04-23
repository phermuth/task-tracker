// 🔐 Página de inicio de sesión
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

// Componentes
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

// Iconos
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

/**
 * Página de inicio de sesión
 * @returns {JSX.Element} - Componente de página de inicio de sesión
 */
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para error general
  const [error, setError] = useState('');
  
  // Estado de carga
  const [loading, setLoading] = useState(false);
  
  // Obtener mensaje de redirección si existe
  const sessionExpired = new URLSearchParams(location.search).get('session') === 'expired';
  
  // Configuración del formulario con Formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email inválido')
        .required('El email es obligatorio'),
      password: Yup.string()
        .required('La contraseña es obligatoria')
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);
        
        // Intentar iniciar sesión
        await login(values);
        
        // Redireccionar al dashboard en caso de éxito
        navigate('/dashboard');
      } catch (error) {
        console.error('❌ Error al iniciar sesión:', error);
        setError(
          error.response?.data?.message || 
          'Error al iniciar sesión. Por favor, verifica tus credenciales.'
        );
      } finally {
        setLoading(false);
      }
    }
  });
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 flex justify-center items-center">
            <span className="text-primary-600">📝</span>
            <span className="ml-2">TaskTracker</span>
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Regístrate
            </Link>
          </p>
          
          {/* Mensaje de sesión expirada */}
          {sessionExpired && (
            <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
              Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
            </div>
          )}
        </div>
        
        {/* Formulario de inicio de sesión */}
        <Card>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Error general */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {/* Email */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="tu@email.com"
              required
              icon={<RiMailLine className="text-gray-400" />}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />
            
            {/* Contraseña */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="••••••••"
                required
                icon={<RiLockLine className="text-gray-400" />}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
              
              {/* Botón para mostrar/ocultar contraseña */}
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            
            {/* Enlace de recuperación de contraseña */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            {/* Botón de envío */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;