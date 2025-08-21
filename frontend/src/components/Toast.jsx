import { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg border shadow-lg min-w-80 animate-slide-in ${getStyles(toast.type)}`}
        >
          <div className="flex items-center space-x-3">
            {getIcon(toast.type)}
            <p className="text-sm font-medium text-gray-800">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;