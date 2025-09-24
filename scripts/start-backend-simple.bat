@echo off
echo ========================================
echo   BACKEND RAPIDO - SPRING BOOT
echo ========================================
echo.

cd /d "%~dp0..\backend"

:: Configurar variables de entorno
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;C:\Program Files\Apache\maven\bin;%PATH%"

echo Configurando base de datos...
mysql -u root -psismosroot -e "CREATE DATABASE IF NOT EXISTS seismic_platform;" 2>nul

echo.
echo Compilando con Maven wrapper...
.\mvnw.cmd clean compile -DskipTests -q

if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo en compilacion
    pause
    exit /b 1
)

echo.
echo Iniciando Spring Boot...
echo Backend URL: http://localhost:8080/api
echo.

.\mvnw.cmd spring-boot:run -DskipTests

pause
