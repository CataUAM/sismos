@echo off
echo ========================================
echo   INICIANDO BACKEND - SPRING BOOT
echo ========================================
echo.

cd /d "%~dp0..\backend"

echo Verificando Java...
java -version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Java no encontrado. Instale Java 17+
    pause
    exit /b 1
)

echo.
echo Verificando Maven...
mvn -version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Maven no encontrado. Instale Maven 3.8+
    pause
    exit /b 1
)

echo.
echo Compilando y ejecutando backend...
echo URL: http://localhost:8080/api
echo.

mvn spring-boot:run

pause
