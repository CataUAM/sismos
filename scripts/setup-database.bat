@echo off
echo ========================================
echo   CONFIGURACION BASE DE DATOS MYSQL
echo ========================================
echo.

echo INSTRUCCIONES:
echo 1. Asegurese de tener MySQL 8.0+ instalado y ejecutandose
echo 2. Tenga las credenciales de root de MySQL listas
echo 3. El script creara la base de datos 'seismic_platform'
echo.

set /p MYSQL_ROOT_PASSWORD="Ingrese la contraseña de root de MySQL: "

echo.
echo Creando base de datos...

mysql -u root -p%MYSQL_ROOT_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS seismic_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% neq 0 (
    echo ERROR: No se pudo crear la base de datos
    pause
    exit /b 1
)

echo.
echo Creando usuario de aplicacion...

mysql -u root -p%MYSQL_ROOT_PASSWORD% -e "CREATE USER IF NOT EXISTS 'seismic_user'@'localhost' IDENTIFIED BY 'seismic_pass123';"
mysql -u root -p%MYSQL_ROOT_PASSWORD% -e "GRANT ALL PRIVILEGES ON seismic_platform.* TO 'seismic_user'@'localhost';"
mysql -u root -p%MYSQL_ROOT_PASSWORD% -e "FLUSH PRIVILEGES;"

if %ERRORLEVEL% neq 0 (
    echo ERROR: No se pudo crear el usuario
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BASE DE DATOS CONFIGURADA EXITOSAMENTE
echo ========================================
echo.
echo Base de datos: seismic_platform
echo Usuario: seismic_user
echo Contraseña: seismic_pass123
echo Host: localhost:3306
echo.
echo Las tablas se crearan automaticamente al iniciar el backend.
echo.

pause
