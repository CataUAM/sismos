@echo off
echo ========================================
echo   VERIFICACION DE PRERREQUISITOS
echo ========================================
echo.

set "ALL_OK=1"

echo Verificando Java 17+...
java -version 2>&1 | findstr "17\|18\|19\|20\|21" >nul
if %ERRORLEVEL% equ 0 (
    echo ✓ Java OK
    java -version 2>&1 | head -1
) else (
    echo ✗ Java 17+ no encontrado
    set "ALL_OK=0"
)

echo.
echo Verificando Maven 3.8+...
mvn -version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✓ Maven OK
    mvn -version 2>&1 | head -1
) else (
    echo ✗ Maven no encontrado
    set "ALL_OK=0"
)

echo.
echo Verificando Node.js 18+...
node --version 2>&1 | findstr "v1[8-9]\|v2[0-9]" >nul
if %ERRORLEVEL% equ 0 (
    echo ✓ Node.js OK
    node --version
) else (
    echo ✗ Node.js 18+ no encontrado
    set "ALL_OK=0"
)

echo.
echo Verificando npm...
npm --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✓ npm OK
    npm --version
) else (
    echo ✗ npm no encontrado
    set "ALL_OK=0"
)

echo.
echo Verificando MySQL...
mysql --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✓ MySQL OK
    mysql --version
) else (
    echo ⚠ MySQL no encontrado en PATH (puede estar instalado)
)

echo.
echo ========================================
if "%ALL_OK%"=="1" (
    echo   ✓ TODOS LOS PRERREQUISITOS OK
    echo   Puede ejecutar start-all.bat
) else (
    echo   ✗ FALTAN PRERREQUISITOS
    echo   Instale los componentes faltantes
)
echo ========================================

pause
