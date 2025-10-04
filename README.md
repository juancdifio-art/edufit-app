# EduFit - Sistema de Gestión de Rutinas

## 🚀 Inicio Rápido

### 1. Instalar Node.js
Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

### 2. Iniciar la Aplicación
**Opción A - Automático (Recomendado):**
```bash
# Doble clic en:
iniciar-edufit.bat
```

**Opción B - Manual:**
```bash
# Terminal 1 - Servidor API
node server.js

# Terminal 2 - Servidor Frontend  
node serve-frontend.js
```

### 3. Usar la Aplicación
1. Ve a: **http://localhost:8080**
2. **NO uses** `file://` - usa la URL completa
3. **Mantén ambas terminales abiertas** mientras uses la aplicación

### 4. Credenciales de Prueba
- **Email:** `juan@test.com`
- **Contraseña:** `123456`

## 📁 Archivos Principales

### Frontend
- `index.html` - Interfaz de usuario
- `app.js` - Lógica de la aplicación
- `styles.css` - Estilos
- `api-client-fixed.js` - Cliente para la API

### Backend
- `server.js` - Servidor principal
- `config.js` - Configuración
- `serve-frontend.js` - Servidor para el frontend

### Modelos y Rutas
- `models/` - Modelos de MongoDB
- `routes/` - Rutas de la API
- `middleware/` - Middleware de autenticación

### Utilidades
- `create-test-users.js` - Crear usuarios de prueba
- `iniciar-edufit.bat` - Script de inicio automático

## 🔧 Solución de Problemas

### Error de CORS
- **Problema:** "has been blocked by CORS policy"
- **Solución:** Usa `http://localhost:8080` en lugar de abrir `index.html` directamente

### Servidores no inician
- **Problema:** Los puertos 3000 o 8080 están ocupados
- **Solución:** Cierra otras aplicaciones que usen esos puertos

### Login falla
- **Problema:** "Credenciales incorrectas"
- **Solución:** Ejecuta `node create-test-users.js` para crear usuarios de prueba

## 📋 Notas Importantes

- **Mantén ambas terminales abiertas** mientras uses la aplicación
- **Usa siempre** `http://localhost:8080` en el navegador
- **NO abras** `index.html` directamente desde el explorador
- Los datos se guardan en **MongoDB Atlas** (nube)
