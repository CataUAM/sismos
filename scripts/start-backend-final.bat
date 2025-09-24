@echo off
echo ========================================
echo   INICIANDO BACKEND - SPRING BOOT
echo ========================================
echo.

cd /d "%~dp0..\backend"

:: Configurar rutas exactas
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
set "MVN_EXE=C:\Program Files\Apache\maven\bin\mvnd.cmd"

echo Java: %JAVA_EXE%
echo Maven: %MVN_EXE%
echo.

:: Verificar que existen
if not exist "%JAVA_EXE%" (
    echo ERROR: Java no encontrado en %JAVA_EXE%
    pause
    exit /b 1
)

if not exist "%MVN_EXE%" (
    echo ERROR: Maven no encontrado en %MVN_EXE%
    pause
    exit /b 1
)

echo ========================================
echo   CONFIGURANDO BASE DE DATOS
echo ========================================

:: Crear base de datos usando MySQL directamente
echo Creando base de datos seismic_platform...
mysql -u root -psismosroot -e "CREATE DATABASE IF NOT EXISTS seismic_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %ERRORLEVEL% equ 0 (
    echo Base de datos creada exitosamente
) else (
    echo Base de datos ya existe o se creara automaticamente
)

echo.
echo ========================================
echo   COMPILANDO Y EJECUTANDO
echo ========================================

echo Limpiando proyecto...
"%MVN_EXE%" clean -q

echo Compilando proyecto...
"%MVN_EXE%" compile -q

if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo en la compilacion
    pause
    exit /b 1
)

echo.
echo Iniciando Spring Boot...
echo Backend URL: http://localhost:8080/api
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo.

"%MVN_EXE%" spring-boot:run

pause
