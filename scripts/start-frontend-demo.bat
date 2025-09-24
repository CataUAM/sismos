@echo off
echo ========================================
echo   FRONTEND DEMO - PLATAFORMA SISMICA
echo ========================================
echo.

cd /d "%~dp0..\frontend"

echo Iniciando frontend en modo demo...
echo URL: http://localhost:4200
echo.
echo Credenciales de demo:
echo Usuario: admin
echo Contraseña: admin123
echo.
echo El frontend funcionara en modo demo mientras el backend compila.
echo.

npm start
