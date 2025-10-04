/**
 * EduFit - Servidor HTTP para Frontend
 * Servidor simple para servir el frontend y evitar problemas de CORS
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Servir archivos estáticos desde el directorio actual
app.use(express.static('.'));

// Ruta principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🌐 Servidor Frontend iniciado');
    console.log(`📱 Frontend disponible en: http://localhost:${PORT}`);
    console.log(`🔗 Abre esta URL en tu navegador para usar la aplicación`);
    console.log('');
    console.log('📋 Instrucciones:');
    console.log('1. Asegúrate de que el servidor API esté corriendo en puerto 3000');
    console.log('2. Abre http://localhost:8080 en tu navegador');
    console.log('3. Usa las credenciales: juan@test.com / 123456');
});

// Manejar cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor frontend...');
    process.exit(0);
});
