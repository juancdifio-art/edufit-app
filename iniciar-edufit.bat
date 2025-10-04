@echo off
echo ========================================
echo EduFit - Iniciar Aplicacion
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado:
node --version

echo.
echo ========================================
echo PASO 1: Crear usuarios de prueba
echo ========================================
echo.
echo Creando usuarios de prueba en MongoDB...
node create-test-users.js

echo.
echo ========================================
echo PASO 2: Iniciar servidores
echo ========================================
echo.
echo Iniciando servidor API en puerto 3000...
start "EduFit API" cmd /k "node server.js"

echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul

echo Iniciando servidor frontend en puerto 8080...
start "EduFit Frontend" cmd /k "node serve-frontend.js"

echo.
echo ========================================
echo ¡APLICACION INICIADA!
echo ========================================
echo.
echo ✅ Servidor API: http://localhost:3000
echo ✅ Servidor Frontend: http://localhost:8080
echo.
echo 🌐 Abre tu navegador y ve a: http://localhost:8080
echo.
echo 🧪 Credenciales de prueba:
echo    Email: juan@test.com
echo    Contraseña: 123456
echo.
echo 📋 IMPORTANTE: Mantén ambas ventanas abiertas mientras uses la aplicación
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
