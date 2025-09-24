@echo off
echo ========================================
echo   INICIANDO BACKEND - SPRING BOOT
echo ========================================
echo.

cd /d "%~dp0..\backend"

echo Buscando instalaciones de Java y Maven...

:: Buscar Java en ubicaciones comunes
set "JAVA_EXE="
if exist "C:\Program Files\Eclipse Adoptium\jdk-17*\bin\java.exe" (
    for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-17*") do set "JAVA_EXE=%%i\bin\java.exe"
)
if exist "C:\Program Files\Java\jdk-17*\bin\java.exe" (
    for /d %%i in ("C:\Program Files\Java\jdk-17*") do set "JAVA_EXE=%%i\bin\java.exe"
)

:: Buscar Maven en ubicaciones comunes
set "MVN_EXE="
if exist "C:\Program Files\Apache\maven\bin\mvn.cmd" (
    set "MVN_EXE=C:\Program Files\Apache\maven\bin\mvn.cmd"
)
if exist "C:\apache-maven*\bin\mvn.cmd" (
    for /d %%i in ("C:\apache-maven*") do set "MVN_EXE=%%i\bin\mvn.cmd"
)

if "%JAVA_EXE%"=="" (
    echo ERROR: Java 17 no encontrado en ubicaciones comunes
    echo Por favor instale Java 17 desde: https://adoptium.net/temurin/releases/
    pause
    exit /b 1
)

if "%MVN_EXE%"=="" (
    echo ERROR: Maven no encontrado en ubicaciones comunes
    echo Por favor instale Maven desde: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo Java encontrado: %JAVA_EXE%
echo Maven encontrado: %MVN_EXE%
echo.

echo Compilando y ejecutando backend...
echo URL: http://localhost:8080/api
echo.

"%MVN_EXE%" spring-boot:run

pause
