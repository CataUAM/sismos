# Plataforma Sísmica Manizales

Plataforma web completa para el monitoreo sísmico de Manizales desarrollada como parte de una tesis de maestría.

## 🏗️ Estructura del Proyecto

```
seismic-platform/
├── backend/                 # API REST con Spring Boot 3.2 + Java 17
├── frontend/               # Aplicación Angular 17
├── database/              # Scripts de base de datos
├── docker/               # Configuración Docker
├── scripts/              # Scripts de ejecución
└── docs/                # Documentación adicional
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Java 17+
- Node.js 18+
- MySQL 8.0
- Maven 3.8+
- Angular CLI 17+

### 1. Configurar Base de Datos
```bash
# Ejecutar script de configuración
./scripts/setup-database.bat
```

### 2. Ejecutar Backend
```bash
# Desde la raíz del proyecto
./scripts/start-backend.bat
```

### 3. Ejecutar Frontend
```bash
# Desde la raíz del proyecto
./scripts/start-frontend.bat
```

### 4. Ejecutar Todo (Concurrente)
```bash
# Ejecutar backend y frontend simultáneamente
./scripts/start-all.bat
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **Documentación API**: http://localhost:8080/api/swagger-ui.html

## 🔐 Credenciales por Defecto

- **Usuario**: admin
- **Contraseña**: admin123

## 📊 Funcionalidades

- Dashboard en tiempo real con WebSocket
- Mapa interactivo con Mapbox
- Gestión de estaciones sísmicas
- Visualización de lecturas con gráficos
- Sistema de alertas automáticas
- Notificaciones por email/WhatsApp
- Gestión de usuarios y roles

## 📁 Documentación Detallada

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Guía de Configuración](./docs/SETUP_GUIDE.md)
