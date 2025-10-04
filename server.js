/**
 * EduFit API - Main Server
 * Servidor principal de la API REST para EduFit
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

// Importar rutas
const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercises');
const routineRoutes = require('./routes/routines');
const studentRoutes = require('./routes/students');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/students', studentRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
    const dbStatus = {
        isConnected: mongoose.connection.readyState === 1,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
    };
    res.json({
        success: true,
        message: 'EduFit API está funcionando',
        timestamp: new Date().toISOString(),
        database: dbStatus
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenido a EduFit API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            exercises: '/api/exercises',
            routines: '/api/routines',
            students: '/api/students',
            health: '/api/health'
        }
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Función para inicializar el servidor
async function startServer() {
    try {
        // Conectar a la base de datos
        console.log('🚀 Iniciando EduFit API...');
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Conectado a MongoDB Atlas');

        // Iniciar servidor
        const PORT = config.server.port;
        app.listen(PORT, () => {
            console.log('✅ EduFit API iniciada exitosamente');
            console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
            console.log(`📊 Base de datos: ${config.mongodb.database}`);
            console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log('📋 Endpoints disponibles:');
            console.log('   - POST /api/auth/register - Registrar usuario');
            console.log('   - POST /api/auth/login - Iniciar sesión');
            console.log('   - GET  /api/auth/verify - Verificar token');
            console.log('   - GET  /api/exercises - Obtener ejercicios');
            console.log('   - GET  /api/routines - Obtener rutinas');
            console.log('   - GET  /api/students - Obtener alumnos');
            console.log('   - GET  /api/health - Estado del servidor');
        });

    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
}

// Manejar cierre graceful del servidor
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await mongoose.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await mongoose.disconnect();
    process.exit(0);
});

// Iniciar servidor
startServer();


