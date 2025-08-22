import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { reporteService } from '../services/api';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  X, 
  CheckCircle,
  AlertCircle,
  User,
  Building,
  Tag,
  FileText
} from 'lucide-react';

const NuevoReporte = () => {
  const [loading, setLoading] = useState(false);
  const [reporteCreado, setReporteCreado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      tipo_atencion: 'Remoto',
      oficina: '',
      area: '',
      contacto: '',
      tecnico: '',
      medio: 'Correo',
      categoria: '',
      prioridad: 'Media',
      descripcion: ''
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await reporteService.crear(data);
      setReporteCreado(response.reporte);
      setMostrarModal(true);
      addToast('Reporte creado exitosamente', 'success');
      reset();
    } catch (error) {
      const message = error.response?.data?.message || 'Error creando el reporte';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setMostrarModal(false);
    setReporteCreado(null);
  };

  const handleGoToReportes = () => {
    handleModalClose();
    navigate('/reportes');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Reporte de Soporte</h1>
          <p className="text-gray-600">
            Completa el formulario para registrar un nuevo caso de soporte
          </p>
        </div>
        <button
          onClick={() => navigate('/reportes')}
          className="btn-secondary flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Información del Contacto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Contacto *
              </label>
              <input
                type="text"
                {...register('contacto', { required: 'El contacto es requerido' })}
                className="input-field w-full"
                placeholder="Nombre completo"
              />
              {errors.contacto && (
                <p className="text-red-600 text-sm mt-1">{errors.contacto.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Técnico Asignado *
              </label>
              <input
                type="text"
                {...register('tecnico', { required: 'El técnico es requerido' })}
                className="input-field w-full"
                placeholder="Nombre del técnico"
              />
              {errors.tecnico && (
                <p className="text-red-600 text-sm mt-1">{errors.tecnico.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Información Organizacional
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oficina *
              </label>
              <input
                type="text"
                {...register('oficina', { required: 'La oficina es requerida' })}
                className="input-field w-full"
                placeholder="Ej: Oficina Central"
              />
              {errors.oficina && (
                <p className="text-red-600 text-sm mt-1">{errors.oficina.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área *
              </label>
              <select
                {...register('area', { required: 'El área es requerida' })}
                className="input-field w-full"
              >
                <option value="">Seleccionar área</option>
                <option value="Sistemas">Sistemas</option>
                <option value="Redes">Redes</option>
                <option value="Soporte">Soporte</option>
                <option value="Administración">Administración</option>
                <option value="Ventas">Ventas</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
              </select>
              {errors.area && (
                <p className="text-red-600 text-sm mt-1">{errors.area.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Detalles del Incidente
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Atención *
              </label>
              <select
                {...register('tipo_atencion')}
                className="input-field w-full"
              >
                <option value="Remoto">Remoto</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medio de Contacto *
              </label>
              <select
                {...register('medio')}
                className="input-field w-full"
              >
                <option value="Correo">Correo</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Presencial">Presencial</option>
                <option value="Chat">Chat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                {...register('categoria', { required: 'La categoría es requerida' })}
                className="input-field w-full"
              >
                <option value="">Seleccionar</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Red">Red</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.categoria && (
                <p className="text-red-600 text-sm mt-1">{errors.categoria.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad *
              </label>
              <select
                {...register('prioridad')}
                className="input-field w-full"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Problema *
            </label>
            <textarea
              {...register('descripcion', { 
                required: 'La descripción es requerida',
                minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' }
              })}
              className="input-field w-full"
              rows={4}
              placeholder="Describe detalladamente el problema o solicitud..."
            />
            {errors.descripcion && (
              <p className="text-red-600 text-sm mt-1">{errors.descripcion.message}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {watchedValues.descripcion?.length || 0} caracteres
            </p>
          </div>
        </div>

        {/* Vista previa */}
        <div className="card bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Vista Previa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Contacto:</span>
              <span className="ml-2">{watchedValues.contacto || 'Sin especificar'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Técnico:</span>
              <span className="ml-2">{watchedValues.tecnico || 'Sin especificar'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Área:</span>
              <span className="ml-2">{watchedValues.area || 'Sin especificar'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Categoría:</span>
              <span className="ml-2">{watchedValues.categoria || 'Sin especificar'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Prioridad:</span>
              <span className="ml-2">{watchedValues.prioridad}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Tipo:</span>
              <span className="ml-2">{watchedValues.tipo_atencion}</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/reportes')}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Crear Reporte
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal de confirmación */}
      {mostrarModal && reporteCreado && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Reporte Creado Exitosamente!
                </h3>
                <p className="text-gray-600 mb-4">
                  Se ha creado el reporte #{reporteCreado.id} y se han enviado las notificaciones correspondientes.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-left space-y-2 text-sm">
                    <div>
                      <span className="font-medium">ID:</span> #{reporteCreado.id}
                    </div>
                    <div>
                      <span className="font-medium">Contacto:</span> {reporteCreado.contacto}
                    </div>
                    <div>
                      <span className="font-medium">Estado:</span> {reporteCreado.estado}
                    </div>
                    <div>
                      <span className="font-medium">Prioridad:</span> {reporteCreado.prioridad}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleModalClose}
                    className="btn-secondary flex-1"
                  >
                    Crear Otro
                  </button>
                  <button
                    onClick={handleGoToReportes}
                    className="btn-primary flex-1"
                  >
                    Ver Reportes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevoReporte;