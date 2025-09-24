@echo off
echo ========================================
echo   SISTEMA COMPLETO - PLATAFORMA SISMICA
echo ========================================
echo.

echo Iniciando backend (Spring Boot)...
start "Backend" cmd /k "cd /d %~dp0..\backend && set JAVA_HOME=C:\Program Files\Java\jdk-17 && .\mvnw.cmd spring-boot:run -DskipTests"

timeout /t 10 /nobreak

echo Iniciando frontend (Angular)...
start "Frontend" cmd /k "cd /d %~dp0..\frontend && npm start"

echo.
echo ========================================
echo   SISTEMA INICIADO CORRECTAMENTE
echo ========================================
echo.
echo Backend URL: http://localhost:8080/api
echo Frontend URL: http://localhost:4200
echo.
echo Credenciales de prueba:
echo Usuario: admin
echo Contraseña: admin123
echo.
echo Presiona cualquier tecla para salir...
pause >nul
