import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { reporteService } from '../services/api';
import ReporteModal from '../components/ReporteModal';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Calendar,
  User,
  Tag
} from 'lucide-react';

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [reportesFiltrados, setReportesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    cargarReportes();
  }, []);

  useEffect(() => {
    filtrarReportes();
  }, [reportes, searchTerm, filtroEstado, filtroCategoria]);

  const cargarReportes = async () => {
    try {
      const data = await reporteService.obtenerTodos();
      setReportes(data);
    } catch (error) {
      addToast('Error cargando reportes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtrarReportes = () => {
    let filtered = reportes;

    if (searchTerm) {
      filtered = filtered.filter(reporte =>
        reporte.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reporte.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reporte.area.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtroEstado) {
      filtered = filtered.filter(reporte => reporte.estado === filtroEstado);
    }

    if (filtroCategoria) {
      filtered = filtered.filter(reporte => reporte.categoria === filtroCategoria);
    }

    setReportesFiltrados(filtered);
  };

  const handleVerDetalle = async (id) => {
    try {
      const reporte = await reporteService.obtenerPorId(id);
      setReporteSeleccionado(reporte);
      setModalAbierto(true);
    } catch (error) {
      addToast('Error cargando detalle del reporte', 'error');
    }
  };

  const handleCerrarReporte = async (id, observaciones) => {
    try {
      await reporteService.cerrar(id, observaciones);
      addToast('Reporte cerrado exitosamente', 'success');
      await cargarReportes();
      setModalAbierto(false);
    } catch (error) {
      addToast('Error cerrando el reporte', 'error');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Abierto':
        return 'bg-yellow-100 text-yellow-800';
      case 'En proceso':
        return 'bg-blue-100 text-blue-800';
      case 'Cerrado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Crítica':
        return 'bg-red-100 text-red-800';
      case 'Alta':
        return 'bg-orange-100 text-orange-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Abierto':
        return <Clock className="h-4 w-4" />;
      case 'En proceso':
        return <AlertCircle className="h-4 w-4" />;
      case 'Cerrado':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de Soporte</h1>
          <p className="text-gray-600">
            {user?.rol === 'admin' ? 'Todos los reportes del sistema' : 'Tus reportes de soporte'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">
            Total: {reportesFiltrados.length} reportes
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar reportes..."
              className="input-field w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              className="input-field w-full pl-10"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="Abierto">Abierto</option>
              <option value="En proceso">En proceso</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          <div className="relative">
            <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              className="input-field w-full pl-10"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Red">Red</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setFiltroEstado('');
              setFiltroCategoria('');
            }}
            className="btn-secondary w-full"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Lista de reportes */}
      <div className="space-y-4">
        {reportesFiltrados.length === 0 ? (
          <div className="card text-center py-12">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron reportes
            </h3>
            <p className="text-gray-600">
              {searchTerm || filtroEstado || filtroCategoria
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no hay reportes registrados'
              }
            </p>
          </div>
        ) : (
          reportesFiltrados.map((reporte) => (
            <div key={reporte.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm font-medium text-gray-500">
                      #{reporte.id}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(reporte.estado)}`}>
                      {getEstadoIcon(reporte.estado)}
                      <span className="ml-1">{reporte.estado}</span>
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadColor(reporte.prioridad)}`}>
                      {reporte.prioridad}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {reporte.descripcion.substring(0, 100)}
                    {reporte.descripcion.length > 100 && '...'}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {reporte.contacto}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      {reporte.area}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(reporte.createdAt).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {reporte.categoria}
                    </div>
                  </div>
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => handleVerDetalle(reporte.id)}
                    className="btn-primary flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalle
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de detalle */}
      {modalAbierto && reporteSeleccionado && (
        <ReporteModal
          reporte={reporteSeleccionado}
          onClose={() => setModalAbierto(false)}
          onCerrarReporte={handleCerrarReporte}
          userRole={user?.rol}
        />
      )}
    </div>
  );
};

export default Reportes;