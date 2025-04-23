// 📊 Página del dashboard principal
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService, categoryService } from '../../services/api';

// Componentes
import Card from '../../components/Card';
import Button from '../../components/Button';

// Gráficos
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Iconos
import { 
  RiAddLine, 
  RiTaskLine, 
  RiCheckboxCircleLine, 
  RiTimeLine, 
  RiAlarmWarningLine,
  RiPriceTag3Line
} from 'react-icons/ri';

// Registrar componentes de ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

/**
 * Página de dashboard
 * @returns {JSX.Element} - Componente de página de dashboard
 */
const DashboardPage = () => {
  // Estados
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar estadísticas
        const statsResponse = await taskService.getTaskStats();
        
        // Cargar tareas recientes (pendientes e importantes)
        const tasksResponse = await taskService.getAllTasks({ priority: 'high' });
        
        // Cargar categorías
        const categoriesResponse = await categoryService.getAllCategories();
        
        // Actualizar estados
        setStats(statsResponse.data.stats);
        setTasks(tasksResponse.data.tasks.slice(0, 5)); // Solo mostrar las 5 primeras
        setCategories(categoriesResponse.data.categories);
      } catch (error) {
        console.error('❌ Error al cargar datos del dashboard:', error);
        setError('Error al cargar datos. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Datos para el gráfico de donut (tareas por estado)
  const getStatusChartData = () => {
    if (!stats) return null;
    
    return {
      labels: ['Completadas', 'Pendientes', 'En progreso'],
      datasets: [
        {
          data: [
            stats.completed_tasks || 0,
            stats.pending_tasks || 0,
            stats.in_progress_tasks || 0
          ],
          backgroundColor: [
            '#22c55e', // Verde (completadas)
            '#f59e0b', // Amarillo (pendientes)
            '#3b82f6', // Azul (en progreso)
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Datos para el gráfico de barras (tareas por categoría)
  const getCategoryChartData = () => {
    if (!categories || categories.length === 0) return null;
    
    // Filtrar categorías sin tareas
    const categoriesWithTasks = categories
      .filter(cat => cat.task_count > 0)
      .slice(0, 7); // Limitar a 7 categorías para el gráfico
    
    return {
      labels: categoriesWithTasks.map(cat => cat.name),
      datasets: [
        {
          label: 'Tareas por categoría',
          data: categoriesWithTasks.map(cat => cat.task_count),
          backgroundColor: categoriesWithTasks.map(cat => cat.color || '#6366f1'),
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Opciones para los gráficos
  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  
  // Formato para mostrar fechas de tareas
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <Button 
          variant="primary" 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1>
        <Link to="/tasks/new">
          <Button variant="primary">
            <RiAddLine className="mr-1" /> Nueva tarea
          </Button>
        </Link>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total de tareas */}
        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-800">
              <RiTaskLine className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de tareas</p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats?.total_tasks || 0}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Tareas completadas */}
        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <RiCheckboxCircleLine className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completadas</p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats?.completed_tasks || 0}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Tareas en progreso */}
        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <RiTimeLine className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En progreso</p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats?.in_progress_tasks || 0}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Tareas vencidas */}
        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-800">
              <RiAlarmWarningLine className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vencidas</p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats?.overdue_tasks || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Gráficos y listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de distribución de tareas */}
        <Card title="Distribución de tareas" className="lg:col-span-1">
          <div className="h-64">
            {stats ? (
              <Doughnut data={getStatusChartData()} options={chartOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Gráfico de tareas por categoría */}
        <Card title="Tareas por categoría" className="lg:col-span-2">
          <div className="h-64">
            {categories.length > 0 ? (
              <Bar data={getCategoryChartData()} options={chartOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Tareas prioritarias */}
        <Card 
          title="Tareas prioritarias" 
          icon={<RiAlarmWarningLine />}
          className="lg:col-span-2"
        >
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map(task => (
                <Link 
                  key={task.id} 
                  to={`/tasks/${task.id}`}
                  className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {task.description || 'Sin descripción'}
                      </p>
                      {task.category_name && (
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2"
                          style={{ 
                            backgroundColor: `${task.category_color}20`, 
                            color: task.category_color 
                          }}
                        >
                          {task.category_icon && <span className="mr-1">{task.category_icon}</span>}
                          {task.category_name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status === 'completed' ? 'Completada' :
                         task.status === 'in_progress' ? 'En progreso' :
                         task.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-gray-500 mt-1">
                          Vence: {formatDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="mt-4 text-center">
                <Link to="/tasks">
                  <Button variant="outline" size="sm">
                    Ver todas las tareas
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No tienes tareas prioritarias</p>
              <Link to="/tasks/new">
                <Button variant="primary" size="sm">
                  <RiAddLine className="mr-1" /> Crear tarea
                </Button>
              </Link>
            </div>
          )}
        </Card>
        
        {/* Categorías */}
        <Card 
          title="Categorías" 
          icon={<RiPriceTag3Line />}
          className="lg:col-span-1"
        >
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.slice(0, 6).map(category => (
                <Link 
                  key={category.id} 
                  to={`/tasks?category=${category.id}`}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-gray-700">
                      {category.icon && <span className="mr-1">{category.icon}</span>}
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {category.task_count || 0} tareas
                  </span>
                </Link>
              ))}
              
              <div className="mt-4 text-center">
                <Link to="/categories">
                  <Button variant="outline" size="sm">
                    Administrar categorías
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No hay categorías personalizadas</p>
              <Link to="/categories">
                <Button variant="primary" size="sm">
                  <RiAddLine className="mr-1" /> Crear categoría
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;