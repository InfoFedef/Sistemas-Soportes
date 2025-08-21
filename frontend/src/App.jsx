import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reportes from './pages/Reportes';
import NuevoReporte from './pages/NuevoReporte';
import MesaAyuda from './pages/MesaAyuda';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Toast />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reportes" element={
                <ProtectedRoute>
                  <Layout>
                    <Reportes />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/nuevo-reporte" element={
                <ProtectedRoute>
                  <Layout>
                    <NuevoReporte />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/mesa-ayuda" element={
                <ProtectedRoute>
                  <Layout>
                    <MesaAyuda />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;