/**
 * Configuración para Vercel
 */

module.exports = {
    // Configuración de la base de datos
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://usuario:password@cluster.mongodb.net/edufit?retryWrites=true&w=majority',
    
    // Configuración JWT
    JWT_SECRET: process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui',
    
    // Configuración del servidor
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'production',
    
    // Configuración de CORS
    cors: {
        origin: [
            'https://rutinas-86vmm6jwg-difios-projects.vercel.app',
            'http://localhost:3000',
            'http://localhost:8080'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
};