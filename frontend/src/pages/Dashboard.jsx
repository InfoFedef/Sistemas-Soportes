import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { dashboardService } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const data = await dashboardService.obtenerEstadisticas();
      setEstadisticas(data);
    } catch (error) {
      addToast('Error cargando estadísticas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (formato) => {
    try {
      await dashboardService.exportar(formato);
      addToast(`Exportando en formato ${formato.toUpperCase()}`, 'success');
    } catch (error) {
      addToast('Error al exportar', 'error');
    }
  };

  const formatearDatosGrafica = (datos) => {
    return Object.entries(datos || {}).map(([key, value]) => ({
      name: key,
      value: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const totalReportes = Object.values(estadisticas?.reportes_por_estado || {})
    .reduce((sum, count) => sum + count, 0);

  const reportesAbiertos = estadisticas?.reportes_por_estado?.Abierto || 0;
  const reportesCerrados = estadisticas?.reportes_por_estado?.Cerrado || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard - {estadisticas?.mes_actual?.nombre}
          </h1>
          <p className="text-gray-600">
            Bienvenido de vuelta, {user?.nombre}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('pdf')}
            className="btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="btn-primary flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Excel
          </button>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100">Total Reportes</p>
              <p className="text-2xl font-bold">{totalReportes}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-yellow-100">Abiertos</p>
              <p className="text-2xl font-bold">{reportesAbiertos}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-green-100">Cerrados</p>
              <p className="text-2xl font-bold">{reportesCerrados}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100">Tasa Resolución</p>
              <p className="text-2xl font-bold">
                {totalReportes > 0 ? Math.round((reportesCerrados / totalReportes) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reportes por Área */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Reportes por Área
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatearDatosGrafica(estadisticas?.reportes_por_area)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reportes por Categoría */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Reportes por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatearDatosGrafica(estadisticas?.reportes_por_categoria)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {formatearDatosGrafica(estadisticas?.reportes_por_categoria).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volumen mensual */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Volumen de Reportes del Mes
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={estadisticas?.volumen_mensual || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cantidad" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Reportes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;