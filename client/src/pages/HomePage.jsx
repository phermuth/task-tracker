// 🏠 Página de inicio de la aplicación
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componentes
import Button from '../components/Button';

// Iconos
import { RiArrowRightLine, RiCheckboxCircleLine } from 'react-icons/ri';

/**
 * Página de inicio (landing page)
 * @returns {JSX.Element} - Componente de página de inicio
 */
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  // Lista de características
  const features = [
    {
      title: 'Organiza tus tareas',
      description: 'Crea, organiza y administra tus tareas de forma sencilla.',
      icon: '📋'
    },
    {
      title: 'Categoriza todo',
      description: 'Agrupa tus tareas en categorías personalizables.',
      icon: '🏷️'
    },
    {
      title: 'Mide tu progreso',
      description: 'Visualiza estadísticas y mejora tu productividad.',
      icon: '📊'
    }
  ];
  
  return (
    <div className="bg-white">
      {/* Sección de héroe */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Gestiona tus tareas</span>
                  <span className="block text-primary-600">de forma efectiva</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  TaskTracker te ayuda a organizar tus tareas, establecer prioridades y categorizar todo lo que necesitas hacer. Aumenta tu productividad y nunca olvides una tarea importante.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to={isAuthenticated ? '/dashboard' : '/register'}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      {isAuthenticated ? 'Ir al Dashboard' : 'Comenzar gratis'} <RiArrowRightLine className="ml-2" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to={isAuthenticated ? '/tasks' : '/login'}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                    >
                      {isAuthenticated ? 'Ver mis tareas' : 'Iniciar sesión'}
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1076&q=80"
            alt="Persona trabajando en computadora"
          />
        </div>
      </div>

      {/* Sección de características */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para organizarte
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              TaskTracker ofrece todas las herramientas necesarias para gestionar tus tareas de manera eficiente.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-900 text-2xl">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de beneficios */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Beneficios</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              ¿Por qué usar TaskTracker?
            </p>
          </div>

          <div className="mt-10">
            <ul className="space-y-4">
              {[
                'Interfaz intuitiva y fácil de usar',
                'Organización por categorías personalizables',
                'Seguimiento de progreso con estadísticas',
                'Establecimiento de prioridades y fechas límite',
                'Aplicación responsive: funciona en todos tus dispositivos'
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <RiCheckboxCircleLine className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">{benefit}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <Button variant="primary" size="lg">
                {isAuthenticated ? 'Ir a mi dashboard' : 'Registrarme gratis'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <h2 className="text-2xl font-bold">
                <span className="text-primary-400">📝</span> TaskTracker
              </h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-gray-400 md:text-right">
                &copy; {new Date().getFullYear()} TaskTracker. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;