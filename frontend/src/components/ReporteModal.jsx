import { useState } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  FileText,
  Building,
  Tag,
  MessageSquare
} from 'lucide-react';

const ReporteModal = ({ reporte, onClose, onCerrarReporte, userRole }) => {
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCerrar = async () => {
    if (reporte.estado === 'Cerrado') return;
    
    setLoading(true);
    try {
      await onCerrarReporte(reporte.id, observaciones);
    } finally {
      setLoading(false);
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

  const puedeSerCerrado = reporte.estado !== 'Cerrado' && (
    userRole === 'admin' || reporte.usuario_id === reporte.User?.id
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Reporte #{reporte.id}
            </h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(reporte.estado)}`}>
              {reporte.estado}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadColor(reporte.prioridad)}`}>
              {reporte.prioridad}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Contacto</p>
                <p className="text-sm text-gray-600">{reporte.contacto}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Oficina</p>
                <p className="text-sm text-gray-600">{reporte.oficina}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Tag className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Área</p>
                <p className="text-sm text-gray-600">{reporte.area}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Técnico</p>
                <p className="text-sm text-gray-600">{reporte.tecnico}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Medio</p>
                <p className="text-sm text-gray-600">{reporte.medio}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Tag className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Categoría</p>
                <p className="text-sm text-gray-600">{reporte.categoria}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Descripción del Problema
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line">
                {reporte.descripcion}
              </p>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha de Creación</p>
                <p className="text-sm text-gray-600">
                  {new Date(reporte.createdAt).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            {reporte.fecha_inicio && (
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Fecha de Inicio</p>
                  <p className="text-sm text-gray-600">
                    {new Date(reporte.fecha_inicio).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            )}

            {reporte.fecha_fin && (
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Fecha de Cierre</p>
                  <p className="text-sm text-gray-600">
                    {new Date(reporte.fecha_fin).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Información de notificaciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Estado de Notificaciones</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                {reporte.notificado_admin ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Administrador notificado</span>
              </div>
              <div className="flex items-center space-x-2">
                {reporte.notificado_usuario ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Usuario notificado</span>
              </div>
            </div>
          </div>

          {/* Observaciones existentes */}
          {reporte.observaciones && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Observaciones de Cierre
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {reporte.observaciones}
                </p>
                {reporte.cerrado_por && (
                  <p className="text-sm text-gray-500 mt-2">
                    Cerrado por: {reporte.cerrado_por === 'admin' ? 'Administrador' : 'Usuario'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sección para cerrar reporte */}
          {puedeSerCerrado && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Cerrar Reporte
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones de cierre (opcional)
                  </label>
                  <textarea
                    className="input-field w-full"
                    rows={4}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Describe la solución aplicada o motivo de cierre..."
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Importante
                      </p>
                      <p className="text-sm text-yellow-700">
                        Una vez cerrado, el reporte no podrá ser reabierto. 
                        Asegúrate de que el problema ha sido completamente resuelto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cerrar Vista
          </button>
          
          {puedeSerCerrado && (
            <button
              onClick={handleCerrar}
              disabled={loading}
              className="btn-primary flex items-center bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cerrando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Cerrar Reporte
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReporteModal;