# 🚀 Guía de Comandos para Levantar los Proyectos

Esta guía contiene todos los comandos necesarios para ejecutar la plataforma sísmica completa.

## 📋 Prerrequisitos Verificados

```bash
# Verificar instalaciones
node --version    # Debe ser v18.x.x o superior
java --version    # Debe ser 17.x.x o superior  
mysql --version   # Debe ser 8.0.x
git --version     # Cualquier versión reciente
```

## 🗂️ Estructura de Directorios

```
seismic-platform/
├── frontend/     # Angular 17 App
├── backend/      # Spring Boot API  
└── database/     # Scripts SQL
```

## 🔧 Configuración Inicial (Solo Primera Vez)

### 1. Clonar Repositorios
```bash
# Crear directorio principal
mkdir seismic-platform
cd seismic-platform

# Clonar repositorios
git clone https://github.com/CataUAM/FrontSismos.git frontend
git clone https://github.com/CataUAM/BackSismos.git backend
```

### 2. Configurar Base de Datos MySQL
```bash
# Conectar a MySQL como root
mysql -u root -p

# Ejecutar en MySQL:
CREATE DATABASE seismic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'seismic_user'@'localhost' IDENTIFIED BY 'seismic_password';
GRANT ALL PRIVILEGES ON seismic_db.* TO 'seismic_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configurar Token de Mapbox
```bash
# Editar archivo de configuración
# frontend/src/environments/environment.ts
# Cambiar: mapboxToken: 'TU_TOKEN_DE_MAPBOX_AQUI'
```

## ⚡ Comandos de Ejecución Diaria

### Opción 1: Comandos Manuales (2 Terminales)

#### Terminal 1 - Backend:
```bash
cd seismic-platform/backend
./mvnw spring-boot:run
```
**Resultado**: API disponible en http://localhost:8080/api

#### Terminal 2 - Frontend:
```bash
cd seismic-platform/frontend
npm start
```
**Resultado**: App disponible en http://localhost:4200

### Opción 2: Script Automatizado

#### Windows (PowerShell):
```powershell
# Crear script start-all.ps1
@"
# Iniciar Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'seismic-platform/backend'; ./mvnw spring-boot:run"

# Esperar 10 segundos
Start-Sleep -Seconds 10

# Iniciar Frontend  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'seismic-platform/frontend'; npm start"
"@ | Out-File -FilePath start-all.ps1

# Ejecutar script
./start-all.ps1
```

#### Linux/Mac (Bash):
```bash
# Crear script start-all.sh
cat > start-all.sh << 'EOF'
#!/bin/bash

# Iniciar Backend en background
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!

# Esperar que el backend inicie
sleep 15

# Iniciar Frontend
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend: http://localhost:8080/api"
echo "Frontend: http://localhost:4200"

# Esperar a que terminen los procesos
wait
EOF

# Dar permisos y ejecutar
chmod +x start-all.sh
./start-all.sh
```

## 🔄 Comandos de Desarrollo

### Instalar/Actualizar Dependencias
```bash
# Frontend - cuando hay cambios en package.json
cd frontend
npm install

# Backend - cuando hay cambios en pom.xml  
cd backend
./mvnw clean install
```

### Compilar sin Ejecutar
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
./mvnw compile
```

### Ejecutar Tests
```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
./mvnw test
```

## 🛑 Comandos para Detener

### Detener Procesos
```bash
# En Windows (PowerShell)
Get-Process -Name "java" | Where-Object {$_.CommandLine -like "*spring-boot*"} | Stop-Process
Get-Process -Name "node" | Where-Object {$_.CommandLine -like "*angular*"} | Stop-Process

# En Linux/Mac
pkill -f "spring-boot"
pkill -f "ng serve"
```

### Liberar Puertos (Si están ocupados)
```bash
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac  
lsof -ti:8080 | xargs kill -9
lsof -ti:4200 | xargs kill -9
```

## ✅ Verificar que Todo Funciona

### 1. Verificar Backend
```bash
# Probar endpoint público
curl http://localhost:8080/api/estaciones/public/mapa

# O abrir en navegador:
# http://localhost:8080/api/swagger-ui.html
```

### 2. Verificar Frontend
```bash
# Abrir navegador en:
# http://localhost:4200

# Credenciales de prueba:
# Usuario: admin
# Contraseña: admin123
```

## 🔧 Comandos de Mantenimiento

### Limpiar Builds
```bash
# Frontend
cd frontend
rm -rf node_modules dist .angular
npm install

# Backend
cd backend  
./mvnw clean
```

### Actualizar desde Git
```bash
# En cada repositorio
git pull origin main

# Reinstalar dependencias si es necesario
npm install  # Frontend
./mvnw clean install  # Backend
```

### Ver Logs en Tiempo Real
```bash
# Backend logs
cd backend
./mvnw spring-boot:run | tee backend.log

# Frontend logs (ya se muestran en consola)
cd frontend
npm start
```

## 🐛 Solución Rápida de Problemas

### Error: "Puerto en uso"
```bash
# Cambiar puertos en configuración:
# Backend: application.yml -> server.port: 8081
# Frontend: angular.json -> serve.options.port: 4201
```

### Error: "Base de datos no conecta"
```bash
# Verificar conexión
mysql -u seismic_user -p seismic_db

# Si falla, recrear usuario
mysql -u root -p
DROP USER 'seismic_user'@'localhost';
CREATE USER 'seismic_user'@'localhost' IDENTIFIED BY 'seismic_password';
GRANT ALL PRIVILEGES ON seismic_db.* TO 'seismic_user'@'localhost';
```

### Error: "Mapbox no carga"
```bash
# Verificar token en:
# frontend/src/environments/environment.ts
# Obtener token gratuito en: https://www.mapbox.com/
```

## 📊 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:4200 | Aplicación principal |
| Backend API | http://localhost:8080/api | API REST |
| Swagger UI | http://localhost:8080/api/swagger-ui.html | Documentación API |
| Base de Datos | localhost:3306/seismic_db | MySQL |

## 🎯 Comando de Un Solo Paso

```bash
# Ejecutar todo desde la raíz del proyecto
cd seismic-platform && (cd backend && ./mvnw spring-boot:run &) && sleep 15 && (cd frontend && npm start)
```

Este comando inicia el backend, espera 15 segundos, y luego inicia el frontend automáticamente.
