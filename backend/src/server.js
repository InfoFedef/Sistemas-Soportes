const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection, sequelize } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reportes', require('./routes/reportes'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/mesa-ayuda', require('./routes/mesa-ayuda'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sistema de Gestión de Soporte API funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta de salud
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'OK', 
      database: 'Conectada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Desconectada',
      error: error.message 
    });
  }
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({ 
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('📊 Modelos sincronizados con la base de datos');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

startServer();