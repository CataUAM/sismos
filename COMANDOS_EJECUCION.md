# 🚀 Comandos de Ejecución - Plataforma Sísmica

## ⚡ Ejecución Rápida (Recomendado)

### Opción 1: Script Automatizado
```bash
# Ejecutar desde la raíz del proyecto
.\scripts\start-all.bat
```
Este script:
- ✅ Verifica prerrequisitos (Java, Node.js, MySQL)
- 🔄 Compila el backend automáticamente
- 📦 Instala dependencias del frontend si es necesario
- 🚀 Inicia ambos servicios en ventanas separadas
- 📊 Muestra URLs y credenciales

### Opción 2: Comandos Manuales (2 Terminales)

#### Terminal 1 - Backend:
```bash
cd backend
./mvnw spring-boot:run
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## 🔧 Comandos de Configuración Inicial

### 1. Clonar Repositorios
```bash
git clone https://github.com/CataUAM/FrontSismos.git frontend
git clone https://github.com/CataUAM/BackSismos.git backend
```

### 2. Base de Datos MySQL
```sql
CREATE DATABASE seismic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'seismic_user'@'localhost' IDENTIFIED BY 'seismic_password';
GRANT ALL PRIVILEGES ON seismic_db.* TO 'seismic_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Token de Mapbox
```bash
# Editar: frontend/src/environments/environment.ts
mapboxToken: 'pk.eyJ1IjoiVU_TOKEN_AQUI'
```

## 🛠️ Comandos de Desarrollo

### Instalar Dependencias
```bash
# Frontend
cd frontend && npm install

# Backend  
cd backend && ./mvnw clean install
```

### Compilar sin Ejecutar
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && ./mvnw compile
```

### Ejecutar Tests
```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && ./mvnw test
```

## 🔄 Comandos de Mantenimiento

### Limpiar Builds
```bash
# Frontend
cd frontend
rm -rf node_modules dist .angular
npm install

# Backend
cd backend && ./mvnw clean
```

### Actualizar desde Git
```bash
# En cada repositorio
git pull origin main

# Reinstalar dependencias
npm install  # Frontend
./mvnw clean install  # Backend
```

## 🛑 Comandos para Detener

### Windows
```powershell
# Detener por nombre de proceso
taskkill /f /im "java.exe"
taskkill /f /im "node.exe"

# Detener por puerto
netstat -ano | findstr :8080
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Linux/Mac
```bash
# Detener por proceso
pkill -f "spring-boot"
pkill -f "ng serve"

# Detener por puerto
lsof -ti:8080 | xargs kill -9
lsof -ti:4200 | xargs kill -9
```

## ✅ Verificación de Estado

### Verificar Backend
```bash
curl http://localhost:8080/api/estaciones/public/mapa
```

### Verificar Frontend
- Abrir: http://localhost:4200
- Login: admin/admin123

## 📊 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:4200 | Aplicación Angular |
| **Backend API** | http://localhost:8080/api | API REST |
| **Swagger UI** | http://localhost:8080/api/swagger-ui.html | Documentación |
| **Base de Datos** | localhost:3306/seismic_db | MySQL |

## 🎯 Comando Todo-en-Uno

```bash
# Ejecutar desde la raíz del proyecto
cd seismic-platform && (cd backend && ./mvnw spring-boot:run &) && sleep 15 && (cd frontend && npm start)
```

## 🔑 Credenciales Demo

- **Usuario**: admin
- **Contraseña**: admin123  
- **Rol**: SUPER_ADMIN
- **Permisos**: Acceso completo a todas las funcionalidades

## 🐛 Solución de Problemas

### Error: Puerto ocupado
```bash
# Cambiar puertos en configuración
# Backend: application.yml -> server.port: 8081
# Frontend: angular.json -> serve.options.port: 4201
```

### Error: Base de datos
```bash
# Verificar conexión
mysql -u seismic_user -p seismic_db

# Recrear usuario si es necesario
mysql -u root -p
DROP USER 'seismic_user'@'localhost';
CREATE USER 'seismic_user'@'localhost' IDENTIFIED BY 'seismic_password';
GRANT ALL PRIVILEGES ON seismic_db.* TO 'seismic_user'@'localhost';
```

### Error: Mapbox no carga
- Verificar token en `frontend/src/environments/environment.ts`
- Obtener token gratuito en https://www.mapbox.com/
- Verificar conectividad a internet

## 📋 Checklist de Inicio

- [ ] Java 17+ instalado
- [ ] Node.js 18+ instalado  
- [ ] MySQL 8.0 corriendo
- [ ] Base de datos `seismic_db` creada
- [ ] Usuario `seismic_user` configurado
- [ ] Token de Mapbox configurado
- [ ] Repositorios clonados
- [ ] Dependencias instaladas

## 🚀 Flujo de Trabajo Diario

1. **Iniciar**: `.\scripts\start-all.bat`
2. **Desarrollar**: Hacer cambios en código
3. **Probar**: Verificar en http://localhost:4200
4. **Commit**: `git add . && git commit -m "mensaje"`
5. **Push**: `git push origin main`
6. **Detener**: Cerrar ventanas de terminal
