@echo off
echo ========================================
echo 🚀 INICIANDO PLATAFORMA SISMICA COMPLETA
echo ========================================

echo.
echo 📋 Verificando prerrequisitos...

REM Verificar Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Java no encontrado. Instalar Java 17+
    pause
    exit /b 1
)
echo ✅ Java encontrado

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no encontrado. Instalar Node.js 18+
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

REM Verificar MySQL
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  ADVERTENCIA: MySQL no encontrado en PATH
    echo    Asegurate de que MySQL esté corriendo
) else (
    echo ✅ MySQL encontrado
)

echo.
echo ✅ Prerrequisitos verificados correctamente.
echo.

REM Cambiar al directorio del proyecto
cd /d "%~dp0.."

echo ========================================
echo 🖥️  INICIANDO BACKEND (Spring Boot)
echo ========================================

REM Verificar si el directorio backend existe
if not exist "backend" (
    echo ❌ ERROR: Directorio backend no encontrado
    echo    Ejecutar desde la raíz del proyecto seismic-platform
    pause
    exit /b 1
)

echo 🔄 Compilando backend...
cd backend
call mvnw.cmd clean compile -q
if %errorlevel% neq 0 (
    echo ❌ ERROR: Falló la compilación del backend
    pause
    exit /b 1
)

echo 🚀 Iniciando backend en nueva ventana...
start "🖥️ Backend - Spring Boot API" cmd /k "echo 🖥️ BACKEND SPRING BOOT && echo. && echo 📡 API: http://localhost:8080/api && echo 📚 Swagger: http://localhost:8080/api/swagger-ui.html && echo. && mvnw.cmd spring-boot:run"

cd ..
echo ⏳ Esperando 20 segundos para que el backend esté listo...
timeout /t 20 /nobreak >nul

echo.
echo ========================================
echo 🌐 INICIANDO FRONTEND (Angular)
echo ========================================

REM Verificar si el directorio frontend existe
if not exist "frontend" (
    echo ❌ ERROR: Directorio frontend no encontrado
    pause
    exit /b 1
)

cd frontend

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias de Node.js...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ ERROR: Falló la instalación de dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

echo 🚀 Iniciando frontend en nueva ventana...
start "🌐 Frontend - Angular App" cmd /k "echo 🌐 FRONTEND ANGULAR && echo. && echo 🖥️  App: http://localhost:4200 && echo 👤 Usuario: admin && echo 🔑 Password: admin123 && echo. && npm start"

cd ..

echo.
echo ========================================
echo ✅ PLATAFORMA INICIADA CORRECTAMENTE
echo ========================================
echo.
echo 🌐 URLs de acceso:
echo   Frontend:  http://localhost:4200
echo   Backend:   http://localhost:8080/api
echo   Swagger:   http://localhost:8080/api/swagger-ui.html
echo.
echo 🔑 Credenciales demo:
echo   Usuario:   admin
echo   Password:  admin123
echo   Rol:       SUPER_ADMIN
echo.
echo 📋 Funcionalidades disponibles:
echo   ✅ Dashboard interactivo
echo   ✅ Mapa con Mapbox (requiere token)
echo   ✅ Gestión de Estaciones
echo   ✅ Gestión de Acelerógrafos  
echo   ✅ Gestión de Usuarios (solo SUPER_ADMIN)
echo.
echo ⚠️  IMPORTANTE:
echo   - Configurar token de Mapbox en frontend/src/environments/environment.ts
echo   - Verificar que MySQL esté corriendo con la base de datos seismic_db
echo.
echo 🛑 Para detener los servicios, cerrar las ventanas del backend y frontend
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
