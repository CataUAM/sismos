@echo off
echo ========================================
echo   INICIANDO FRONTEND - ANGULAR 17
echo ========================================
echo.

cd /d "%~dp0..\frontend"

echo Verificando Node.js...
node --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js no encontrado. Instale Node.js 18+
    pause
    exit /b 1
)

echo.
echo Verificando npm...
npm --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm no encontrado
    pause
    exit /b 1
)

echo.
echo Instalando dependencias...
npm install

if %ERRORLEVEL% neq 0 (
    echo ERROR: Falló la instalación de dependencias
    pause
    exit /b 1
)

echo.
echo Iniciando servidor de desarrollo...
echo URL: http://localhost:4200
echo.

npm start

pause
