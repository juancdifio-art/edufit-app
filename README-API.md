# EduFit API - Instrucciones de Instalación

## 🚀 Pasos para ejecutar la API REST

### 1. Instalar Node.js
Si no tienes Node.js instalado, descárgalo desde: https://nodejs.org/

### 2. Inicio Automático (Recomendado)
**Opción A - Todo en uno:**
```bash
# Doble clic en start-all.bat
# O ejecutar en terminal:
start-all.bat
```
Este script:
- Instala dependencias automáticamente
- Crea usuarios de prueba
- Inicia el servidor API (puerto 3000)
- Inicia el servidor frontend (puerto 8080)
- Abre automáticamente http://localhost:8080

### 3. Instalación Manual (Si prefieres control total)
**Opción A - Script automático:**
```bash
# Doble clic en install.bat
# O ejecutar en terminal:
install.bat
```

**Opción B - Manual:**
```bash
npm install
```

### 3. Verificar conexión a MongoDB
**Opción A - Script automático (Windows):**
```bash
# Doble clic en test-connection.cmd
# O ejecutar en terminal:
test-connection.cmd
```

**Opción B - Manual:**
```bash
node test-connection.js
```

Esto instalará todas las dependencias necesarias:
- `express` - Framework web
- `mongoose` - ODM para MongoDB
- `cors` - Middleware para CORS
- `bcryptjs` - Encriptación de contraseñas
- `jsonwebtoken` - Autenticación JWT
- `nodemon` - Auto-reload para desarrollo

### 4. Iniciar el servidor
**Opción A - Script simple (recomendado):**
```bash
# Doble clic en start-server-simple.bat
# O ejecutar en terminal:
start-server-simple.bat
```

**Opción B - Script con verificaciones:**
```bash
# Doble clic en start-server-safe.bat
# O ejecutar en terminal:
start-server-safe.bat
```

**Opción C - Manual:**
```bash
node server.js
```

**Opción D - Desarrollo con auto-reload:**
```bash
npm run dev
```

### 5. Crear usuarios de prueba
```bash
# Crear usuarios de prueba en MongoDB
create-test-users.cmd
```

### 6. Verificar usuarios creados
```bash
# Ver qué usuarios hay en la base de datos
check-users.cmd
```

### 7. Verificar que funciona
- El servidor debería iniciarse en `http://localhost:3000`
- Visita `http://localhost:3000` para ver la API funcionando
- Visita `http://localhost:3000/api/health` para verificar el estado

## 📋 Endpoints disponibles

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Ejercicios
- `GET /api/exercises` - Obtener todos los ejercicios
- `POST /api/exercises` - Crear ejercicio personalizado
- `PUT /api/exercises/:id` - Actualizar ejercicio
- `DELETE /api/exercises/:id` - Eliminar ejercicio

### Rutinas
- `GET /api/routines` - Obtener rutinas del usuario
- `POST /api/routines` - Crear nueva rutina
- `PUT /api/routines/:id` - Actualizar rutina
- `DELETE /api/routines/:id` - Eliminar rutina

### Alumnos
- `GET /api/students` - Obtener alumnos del usuario
- `POST /api/students` - Crear nuevo alumno
- `PUT /api/students/:id` - Actualizar alumno
- `DELETE /api/students/:id` - Eliminar alumno

## 🔧 Configuración

La API está configurada para conectarse a MongoDB Atlas:
- **Base de datos**: `edufit`
- **Colecciones**: `users`, `exercises`, `routines`, `students`
- **Puerto**: 3000

## 🧪 Probar la aplicación

1. **Inicia el servidor** con `start-server-simple.bat`
2. **Crea usuarios de prueba** con `create-test-users.cmd`
3. **Abre** `index.html` en el navegador
4. **Inicia sesión** con:
   - Email: `juan@test.com`, Contraseña: `123456`
   - Email: `maria@test.com`, Contraseña: `123456`
   - Email: `carlos@test.com`, Contraseña: `123456`
5. **Prueba** todas las funcionalidades

## ⚠️ Notas importantes

- Asegúrate de que el servidor esté corriendo antes de usar el frontend
- El frontend ahora usa la API REST en lugar de LocalStorage
- Los datos se guardan en MongoDB Atlas
- La autenticación usa JWT tokens

## 🐛 Solución de problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: Script se cuelga al iniciar servidor
**Solución:** Usa el script simple:
```bash
start-server-simple.bat
```

### Error: "Port 3000 already in use"
**Opción 1 - Matar proceso:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Opción 2 - Cambiar puerto:**
Edita `config.js` y cambia el puerto de 3000 a otro número.

### Error de conexión a MongoDB
1. Verifica conexión a internet
2. Ejecuta: `test-connection.cmd`
3. Verifica que la URI de MongoDB en `config.js` sea correcta

### Error: "Windows Script Host"
**Solución:** Usa archivos `.cmd` en lugar de `.js`:
- `test-connection.cmd` (no `test-connection.js`)
- `start-server-simple.bat` (no `start-server.bat`)

## 📞 Soporte

Si tienes problemas, verifica:
1. ✅ Node.js instalado
2. ✅ Dependencias instaladas (`npm install`)
3. ✅ Servidor corriendo (`node server.js`)
4. ✅ Puerto 3000 disponible
5. ✅ Conexión a internet (para MongoDB Atlas)
