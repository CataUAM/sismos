@echo off
echo ========================================
echo Configurando repositorios Git
echo ========================================

echo.
echo Configurando Frontend...
cd /d "C:\Users\Anpipe12\Documents\seismic-platform\frontend"

echo Inicializando repositorio Git...
git init

echo Configurando usuario Git (si no está configurado)...
git config user.name "CataUAM" 2>nul
git config user.email "catalina.herrerab@autonoma.edu.co" 2>nul

echo Agregando archivos al staging...
git add .

echo Realizando commit inicial...
git commit -m "Initial commit: Seismic Platform Frontend - Angular 17 with Mapbox integration, admin modules for stations, accelerographs and users management"

echo Agregando remote origin...
git remote add origin https://github.com/CataUAM/FrontSismos.git

echo Subiendo código al repositorio remoto...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Configurando Backend...
cd /d "C:\Users\Anpipe12\Documents\seismic-platform\backend"

echo Inicializando repositorio Git...
git init

echo Configurando usuario Git (si no está configurado)...
git config user.name "CataUAM" 2>nul
git config user.email "catalina.herrerab@autonoma.edu.co" 2>nul

echo Agregando archivos al staging...
git add .

echo Realizando commit inicial...
git commit -m "Initial commit: Seismic Platform Backend - Spring Boot API for seismic data management"

echo Agregando remote origin...
git remote add origin https://github.com/CataUAM/BackSismos.git

echo Subiendo código al repositorio remoto...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo Configuración completada!
echo ========================================
echo Frontend: https://github.com/CataUAM/FrontSismos.git
echo Backend:  https://github.com/CataUAM/BackSismos.git
echo.
pause
