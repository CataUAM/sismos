@echo off
echo ========================================
echo   INSTALACION DE PRERREQUISITOS
echo ========================================
echo.

echo Este script te guiara para instalar los prerrequisitos necesarios.
echo.

echo 1. JAVA 17 (OpenJDK)
echo ==================
echo Opcion A - Descarga manual (Recomendado):
echo   1. Ir a: https://adoptium.net/temurin/releases/
echo   2. Descargar: OpenJDK 17 LTS - Windows x64 - JDK (.msi)
echo   3. Ejecutar el instalador y seguir las instrucciones
echo.
echo Opcion B - Usar winget (requiere aceptar terminos):
echo   winget install EclipseAdoptium.Temurin.17.JDK
echo.

echo 2. MAVEN 3.9+
echo =============
echo Opcion A - Descarga manual:
echo   1. Ir a: https://maven.apache.org/download.cgi
echo   2. Descargar: apache-maven-3.9.x-bin.zip
echo   3. Extraer en: C:\Program Files\Apache\maven
echo   4. Agregar al PATH: C:\Program Files\Apache\maven\bin
echo.
echo Opcion B - Usar winget:
echo   winget install Apache.Maven
echo.

echo 3. MYSQL 8.0
echo ============
echo   1. Ir a: https://dev.mysql.com/downloads/installer/
echo   2. Descargar: mysql-installer-community-8.0.x.x.msi
echo   3. Ejecutar instalador
echo   4. Configurar contraseña de root durante la instalacion
echo   5. Habilitar MySQL como servicio de Windows
echo.

echo ========================================
echo   VERIFICACION POST-INSTALACION
echo ========================================
echo.
echo Despues de instalar, abrir nueva terminal y verificar:
echo   java -version    (debe mostrar Java 17+)
echo   mvn -version     (debe mostrar Maven 3.8+)
echo   mysql --version  (debe mostrar MySQL 8.0+)
echo.
echo Luego ejecutar: scripts\setup-database.bat
echo Y finalmente: scripts\start-all.bat
echo.

pause
sismosroot