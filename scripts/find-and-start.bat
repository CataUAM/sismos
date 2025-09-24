@echo off
echo ========================================
echo   BUSCANDO JAVA Y MAVEN INSTALADOS
echo ========================================
echo.

:: Buscar Java en ubicaciones comunes
set "JAVA_EXE="
echo Buscando Java...

:: Buscar en Program Files
for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk*") do (
    if exist "%%i\bin\java.exe" (
        set "JAVA_EXE=%%i\bin\java.exe"
        echo Java encontrado en: %%i
        goto :found_java
    )
)

for /d %%i in ("C:\Program Files\Java\jdk*") do (
    if exist "%%i\bin\java.exe" (
        set "JAVA_EXE=%%i\bin\java.exe"
        echo Java encontrado en: %%i
        goto :found_java
    )
)

for /d %%i in ("C:\Program Files (x86)\Eclipse Adoptium\jdk*") do (
    if exist "%%i\bin\java.exe" (
        set "JAVA_EXE=%%i\bin\java.exe"
        echo Java encontrado en: %%i
        goto :found_java
    )
)

:found_java
if "%JAVA_EXE%"=="" (
    echo ERROR: Java no encontrado. Por favor:
    echo 1. Cierre esta terminal
    echo 2. Abra una nueva terminal como administrador
    echo 3. Ejecute este script nuevamente
    pause
    exit /b 1
)

:: Buscar Maven
set "MVN_EXE="
echo Buscando Maven...

for /d %%i in ("C:\Program Files\Apache\*maven*") do (
    if exist "%%i\bin\mvn.cmd" (
        set "MVN_EXE=%%i\bin\mvn.cmd"
        echo Maven encontrado en: %%i
        goto :found_maven
    )
)

for /d %%i in ("C:\apache-maven*") do (
    if exist "%%i\bin\mvn.cmd" (
        set "MVN_EXE=%%i\bin\mvn.cmd"
        echo Maven encontrado en: %%i
        goto :found_maven
    )
)

:: Intentar usar mvn del PATH
mvn -version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "MVN_EXE=mvn"
    echo Maven encontrado en PATH
    goto :found_maven
)

:found_maven
if "%MVN_EXE%"=="" (
    echo ADVERTENCIA: Maven no encontrado, usando wrapper de Maven
    set "MVN_EXE=.\mvnw.cmd"
)

echo.
echo ========================================
echo   CONFIGURANDO BASE DE DATOS
echo ========================================

:: Crear base de datos
echo Creando base de datos seismic_platform...
"%JAVA_EXE%" -cp "mysql-connector-j-8.0.33.jar" -e "CREATE DATABASE IF NOT EXISTS seismic_platform;" >nul 2>&1

echo.
echo ========================================
echo   INICIANDO BACKEND
echo ========================================
echo Java: %JAVA_EXE%
echo Maven: %MVN_EXE%
echo.

cd /d "%~dp0..\backend"

echo Compilando proyecto...
"%MVN_EXE%" clean compile -q

if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo en la compilacion
    pause
    exit /b 1
)

echo.
echo Iniciando Spring Boot...
echo Backend URL: http://localhost:8080/api
echo.

"%MVN_EXE%" spring-boot:run

pause
