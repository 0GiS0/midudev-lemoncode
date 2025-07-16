require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const database = require('./config/database');
const heroesRouter = require('./routes/heroes');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors());

// Compresión
app.use(compression());

// Logging
app.use(morgan('combined'));

// Parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.get('/', (req, res) => {
  res.json({
    message: 'Heroes API - Express.js',
    version: '1.0.0',
    endpoints: {
      heroes: '/api/heroes',
      health: '/health'
    }
  });
});

// Endpoint de salud
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await database.healthCheck();
    const dbStatus = database.getConnectionStatus();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbHealth.status,
        connection: dbStatus.readyStateName,
        host: dbStatus.host,
        port: dbStatus.port,
        database: dbStatus.database
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// API Routes
app.use('/api/heroes', heroesRouter);

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor solo si no estamos en tests
if (require.main === module) {
  // Función para iniciar la aplicación
  async function startApp() {
    try {
      // Conectar a la base de datos
      await database.connect();
      
      // Iniciar servidor
      app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
        console.log(`📋 API disponible en http://localhost:${PORT}`);
        console.log(`🎯 Entorno: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('❌ Error al iniciar la aplicación:', error.message);
      process.exit(1);
    }
  }

  startApp();
}

module.exports = app;
