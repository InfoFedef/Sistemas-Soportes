import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { mesaAyudaService } from '../services/api';
import { 
  Search, 
  HelpCircle, 
  Book, 
  Plus,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Tag
} from 'lucide-react';

const MesaAyuda = () => {
  const [soluciones, setSoluciones] = useState([]);
  const [solucionesFiltradas, setSolucionesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [solucionExpandida, setSolucionExpandida] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaSolucion, setNuevaSolucion] = useState({
    problema: '',
    solucion: '',
    palabras_clave: '',
    categoria: ''
  });

  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    cargarSoluciones();
  }, []);

  useEffect(() => {
    filtrarSoluciones();
  }, [soluciones, searchTerm, categoriaFiltro]);

  const cargarSoluciones = async () => {
    try {
      const data = await mesaAyudaService.obtenerTodas();
      setSoluciones(data);
    } catch (error) {
      addToast('Error cargando la base de conocimiento', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtrarSoluciones = () => {
    let filtered = soluciones;

    if (searchTerm) {
      filtered = filtered.filter(solucion =>
        solucion.problema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solucion.solucion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solucion.palabras_clave.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoriaFiltro) {
      filtered = filtered.filter(solucion => solucion.categoria === categoriaFiltro);
    }

    setSolucionesFiltradas(filtered);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSolucionesFiltradas(soluciones);
      return;
    }

    setLoading(true);
    try {
      const data = await mesaAyudaService.buscar(searchTerm);
      setSolucionesFiltradas(data);
    } catch (error) {
      addToast('Error en la búsqueda', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearSolucion = async (e) => {
    e.preventDefault();
    try {
      await mesaAyudaService.crear(nuevaSolucion);
      addToast('Solución creada exitosamente', 'success');
      setNuevaSolucion({ problema: '', solucion: '', palabras_clave: '', categoria: '' });
      setMostrarFormulario(false);
      await cargarSoluciones();
    } catch (error) {
      addToast('Error creando la solución', 'error');
    }
  };

  const toggleSolucion = (id) => {
    setSolucionExpandida(solucionExpandida === id ? null : id);
  };

  const categorias = [...new Set(soluciones.map(s => s.categoria))];

  if (loading && soluciones.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <HelpCircle className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Mesa de Ayuda</h1>
        <p className="text-gray-600 mt-2">
          Base de conocimiento con soluciones a problemas comunes
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por problema, solución o palabras clave..."
                className="input-field w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="input-field md:w-48"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>

            <button type="submit" className="btn-primary">
              Buscar
            </button>
          </div>

          {user?.rol === 'admin' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="btn-secondary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Solución
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Formulario nueva solución */}
      {mostrarFormulario && user?.rol === 'admin' && (
        <div className="card bg-blue-50 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Agregar Nueva Solución
          </h3>
          
          <form onSubmit={handleCrearSolucion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problema *
                </label>
                <input
                  type="text"
                  required
                  className="input-field w-full"
                  value={nuevaSolucion.problema}
                  onChange={(e) => setNuevaSolucion({
                    ...nuevaSolucion,
                    problema: e.target.value
                  })}
                  placeholder="Describe el problema"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  required
                  className="input-field w-full"
                  value={nuevaSolucion.categoria}
                  onChange={(e) => setNuevaSolucion({
                    ...nuevaSolucion,
                    categoria: e.target.value
                  })}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Red">Red</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solución *
              </label>
              <textarea
                required
                rows={4}
                className="input-field w-full"
                value={nuevaSolucion.solucion}
                onChange={(e) => setNuevaSolucion({
                  ...nuevaSolucion,
                  solucion: e.target.value
                })}
                placeholder="Describe la solución paso a paso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Palabras Clave *
              </label>
              <input
                type="text"
                required
                className="input-field w-full"
                value={nuevaSolucion.palabras_clave}
                onChange={(e) => setNuevaSolucion({
                  ...nuevaSolucion,
                  palabras_clave: e.target.value
                })}
                placeholder="Palabras separadas por comas"
              />
              <p className="text-sm text-gray-500 mt-1">
                Ejemplo: impresora, drivers, usb, conexión
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar Solución
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <Book className="h-8 w-8 mr-3" />
            <div>
              <p className="text-blue-100">Total Soluciones</p>
              <p className="text-2xl font-bold">{soluciones.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <Tag className="h-8 w-8 mr-3" />
            <div>
              <p className="text-green-100">Categorías</p>
              <p className="text-2xl font-bold">{categorias.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <Search className="h-8 w-8 mr-3" />
            <div>
              <p className="text-purple-100">Resultados</p>
              <p className="text-2xl font-bold">{solucionesFiltradas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de soluciones */}
      <div className="space-y-4">
        {solucionesFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron soluciones
            </h3>
            <p className="text-gray-600">
              {searchTerm || categoriaFiltro
                ? 'Intenta ajustar los criterios de búsqueda'
                : 'Aún no hay soluciones registradas'
              }
            </p>
          </div>
        ) : (
          solucionesFiltradas.map((solucion) => (
            <div key={solucion.id} className="card hover:shadow-lg transition-shadow">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleSolucion(solucion.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span className="bg-primary-100 text-primary-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                      {solucion.categoria}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {solucion.problema}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1">
                    {solucion.palabras_clave.split(',').map((palabra, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {palabra.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="ml-4">
                  {solucionExpandida === solucion.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {solucionExpandida === solucion.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Solución:</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {solucion.solucion}
                    </p>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    Actualizado: {new Date(solucion.updatedAt).toLocaleDateString('es-ES')}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MesaAyuda;
