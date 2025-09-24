# 🤝 Instrucciones para Colaboradores - Plataforma Sísmica

## 📋 Información de los Repositorios

### Frontend (Angular 17)
```
https://github.com/CataUAM/FrontSismos.git
```

### Backend (Spring Boot)
```
https://github.com/CataUAM/BackSismos.git
```

## 🚀 Pasos para Colaborar

### 1. Clonar los Repositorios
```bash
# Crear directorio de trabajo
mkdir seismic-platform
cd seismic-platform

# Clonar frontend
git clone https://github.com/CataUAM/FrontSismos.git frontend

# Clonar backend
git clone https://github.com/CataUAM/BackSismos.git backend
```

### 2. Configurar Git (Primera vez)
```bash
# Configurar tu información personal
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@autonoma.edu.co"
```

## 🛠️ Configuración del Entorno

### Frontend - Angular 17
```bash
cd frontend

# Instalar dependencias
npm install

# Configurar token de Mapbox en src/environments/environment.ts
# mapboxToken: 'tu_token_aqui'

# Ejecutar aplicación
npm start
# Disponible en: http://localhost:4200
```

### Backend - Spring Boot
```bash
cd backend

# Configurar base de datos MySQL
# Crear base de datos: seismic_db
# Usuario: seismic_user
# Contraseña: seismic_password

# Ejecutar aplicación
./mvnw spring-boot:run
# Disponible en: http://localhost:8080/api
```

## 📋 Prerrequisitos

### Para Frontend:
- Node.js 18+ LTS
- npm 9+
- Token de Mapbox (https://www.mapbox.com/)

### Para Backend:
- Java 17 o superior
- Maven 3.8+
- MySQL 8.0

## 🔐 Credenciales Demo

### Login de la aplicación:
- **Usuario**: admin
- **Contraseña**: admin123
- **Rol**: SUPER_ADMIN

## 🌟 Funcionalidades Principales

### Frontend:
- Dashboard interactivo con métricas en tiempo real
- Mapa con Mapbox GL JS para visualización de estaciones
- Módulo de administración con pestañas:
  - Gestión de Estaciones (CRUD)
  - Gestión de Acelerógrafos (CRUD)
  - Gestión de Usuarios (solo SUPER_ADMIN)
- Sistema de autenticación JWT
- Control de acceso basado en roles

### Backend:
- API REST completa
- Autenticación JWT con Spring Security
- WebSocket para datos en tiempo real
- Base de datos MySQL con JPA/Hibernate
- Sistema de notificaciones

## 📂 Estructura de Archivos

```
seismic-platform/
├── frontend/                 # Angular 17 App
│   ├── src/app/
│   │   ├── components/      # Componentes UI
│   │   ├── services/        # Servicios Angular
│   │   ├── models/          # Interfaces TypeScript
│   │   └── guards/          # Guards de autenticación
│   └── package.json
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/seismic/
│   │   ├── controller/      # Controladores REST
│   │   ├── service/         # Lógica de negocio
│   │   ├── entity/          # Entidades JPA
│   │   └── repository/      # Repositorios de datos
│   └── pom.xml
```

## 🔄 Flujo de Trabajo

### Para nuevas funcionalidades:
```bash
# Crear rama feature
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "Descripción de cambios"

# Subir rama
git push origin feature/nueva-funcionalidad

# Crear Pull Request en GitHub
```

### Para actualizar tu copia local:
```bash
# Cambiar a main
git checkout main

# Obtener últimos cambios
git pull origin main

# Actualizar dependencias si es necesario
npm install  # Frontend
./mvnw clean install  # Backend
```

## 🐛 Solución de Problemas Comunes

### Frontend:
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Verificar versión de Node
node --version  # Debe ser 18+
```

### Backend:
```bash
# Limpiar build
./mvnw clean

# Verificar versión de Java
java -version  # Debe ser 17+
```

## 📞 Contacto y Soporte

- **Repositorio Principal**: CataUAM
- **Email**: catalina.herrerab@autonoma.edu.co
- **Issues**: Usar GitHub Issues en cada repositorio

## 📄 Documentación Adicional

- README.md en cada repositorio
- Documentación de API: http://localhost:8080/api/swagger-ui.html
- Guías de Angular: https://angular.io/docs
