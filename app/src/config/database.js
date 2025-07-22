const mongoose = require('mongoose');

class Database {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log('📊 Ya conectado a MongoDB');
      return;
    }

    try {
      let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/heroes_db';
      const dbName = process.env.MONGODB_DATABASE || '';

      // Si la URI no tiene la base de datos, añadirla
      if (!mongoUri.match(/\/[a-zA-Z0-9_-]+$/)) {
        mongoUri = mongoUri.replace(/\/$/, '');
        mongoUri += `/${dbName}`;
      }

      console.log(`🔗 Conectando a MongoDB en ${mongoUri}`);

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      await mongoose.connect(mongoUri, options);

      this.isConnected = true;
      console.log('✅ Conectado exitosamente a MongoDB');
      console.log(`📍 URI: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Ocultar credenciales en logs

      // Eventos de conexión
      mongoose.connection.on('error', (error) => {
        console.error('❌ Error de conexión a MongoDB:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ Desconectado de MongoDB');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 Reconectado a MongoDB');
        this.isConnected = true;
      });

      // Manejo elegante de cierre
      process.on('SIGINT', this.gracefulShutdown.bind(this));
      process.on('SIGTERM', this.gracefulShutdown.bind(this));

    } catch (error) {
      console.error('❌ Error al conectar con MongoDB:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('👋 Desconectado de MongoDB');
    } catch (error) {
      console.error('❌ Error al desconectar de MongoDB:', error.message);
      throw error;
    }
  }

  async gracefulShutdown() {
    console.log('\n🛑 Cerrando servidor...');
    await this.disconnect();
    process.exit(0);
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      readyStateName: this.getReadyStateName(mongoose.connection.readyState),
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      database: mongoose.connection.name
    };
  }

  getReadyStateName(state) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[state] || 'unknown';
  }

  // Método para verificar la salud de la conexión
  async healthCheck() {
    try {
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }
}

// Exportar una instancia singleton
const database = new Database();
module.exports = database;
