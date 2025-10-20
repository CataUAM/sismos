# Plataforma Sísmica Manizales - Frontend

Frontend desarrollado en Angular 17 para la plataforma de monitoreo sísmico de Manizales.

## 🚀 Características

- **Angular 17** con arquitectura standalone components
- **Angular Material** para UI/UX moderna
- **Mapbox GL JS** para visualización geográfica interactiva
- **Chart.js** para gráficos de datos sísmicos
- **WebSocket** para datos en tiempo real
- **Autenticación JWT** integrada
- **Responsive Design** para dispositivos móviles y desktop

## 📋 Prerrequisitos

- Node.js 18+ LTS
- npm 9+ o yarn
- Angular CLI 17+
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd seismic-platform-frontend
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Editar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  mapboxAccessToken: 'YOUR_MAPBOX_ACCESS_TOKEN_HERE'
};
```

Para producción, editar `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  mapboxAccessToken: 'YOUR_PRODUCTION_MAPBOX_TOKEN'
};
```

### 4. Obtener token de Mapbox

1. Registrarse en [Mapbox](https://www.mapbox.com/)
2. Crear un token de acceso
3. Configurar el token en el archivo de environment

### 5. Ejecutar la aplicación

```bash
# Desarrollo
ng serve
# o
npm start

# La aplicación estará disponible en http://localhost:4200
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes de la aplicación
│   │   ├── auth/           # Autenticación
│   │   ├── dashboard/      # Panel principal
│   │   ├── mapa/          # Mapa interactivo
│   │   ├── estaciones/    # Gestión de estaciones
│   │   ├── lecturas/      # Visualización de lecturas
│   │   └── usuarios/      # Gestión de usuarios
│   ├── services/          # Servicios Angular
│   ├── models/           # Interfaces y modelos
│   ├── guards/           # Guards de navegación
│   ├── interceptors/     # Interceptores HTTP
│   └── shared/           # Componentes compartidos
├── environments/         # Configuración de entornos
└── assets/              # Recursos estáticos
```

## 🎨 Componentes Principales

### Dashboard
- Estadísticas en tiempo real
- Gráficos de actividad sísmica
- Alertas y notificaciones
- Estado de conexión WebSocket

### Mapa Interactivo
- Visualización de estaciones en Mapbox
- Marcadores diferenciados por estado
- Popups informativos
- Controles de navegación

### Gestión de Estaciones
- Lista completa de estaciones
- Búsqueda y filtrado
- Detalles de cada estación
- Gestión administrativa

### Lecturas Sísmicas
- Visualización tabular de datos
- Filtros por fecha y estación
- Gráficos de tendencias
- Exportación a CSV
- Datos en tiempo real

## 🔐 Autenticación

### Login
- Formulario reactivo con validaciones
- Manejo de errores
- Redirección automática

### Guards
- Protección de rutas autenticadas
- Verificación de roles
- Redirección a login

### Interceptores
- Inyección automática de tokens JWT
- Manejo de errores HTTP
- Renovación automática de tokens

## 🗺️ Integración con Mapbox

### Configuración
```typescript
import * as mapboxgl from 'mapbox-gl';

(mapboxgl as any).accessToken = environment.mapboxAccessToken;

this.map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-75.5138, 5.0703], // Manizales
  zoom: 12
});
```

### Marcadores Personalizados
- Estaciones activas (verde)
- Estaciones inactivas (rojo)
- Popups con información detallada

## 📊 Visualización de Datos

### Chart.js Integration
```typescript
import { Chart, ChartConfiguration } from 'chart.js';

chartData: ChartConfiguration['data'] = {
  datasets: [{
    label: 'Aceleración',
    data: this.lecturas,
    borderColor: '#FF6384',
    backgroundColor: '#FF638420'
  }]
};
```

### Tipos de Gráficos
- Líneas temporales para tendencias
- Gráficos de barras para comparaciones
- Gráficos en tiempo real

## 🔄 WebSocket en Tiempo Real

### Conexión
```typescript
connect(): void {
  const socket = new SockJS(`${environment.apiUrl}/ws`);
  this.stompClient = Stomp.over(socket);
  
  this.stompClient.connect({}, () => {
    this.stompClient.subscribe('/topic/lecturas', (message) => {
      const lectura = JSON.parse(message.body);
      this.handleNewReading(lectura);
    });
  });
}
```

### Manejo de Datos
- Actualización automática del dashboard
- Notificaciones de alertas
- Sincronización de gráficos

## 🎯 Funcionalidades por Rol

### Administrador
- Gestión completa de usuarios
- Configuración del sistema
- Acceso a todas las funcionalidades

### Operador
- Monitoreo de estaciones
- Gestión de lecturas
- Configuración de alertas

### Visualizador
- Solo lectura de datos
- Acceso a dashboards
- Exportación de reportes

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Adaptaciones
- Menú lateral colapsable
- Tablas con scroll horizontal
- Gráficos redimensionables

## 🧪 Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Coverage report
ng test --code-coverage
```

## 🚀 Build y Deployment

### Desarrollo
```bash
ng serve --configuration development
```

### Producción
```bash
# Build para producción
ng build --configuration production

# Los archivos se generan en dist/
```

### Docker
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/seismic-platform-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Configuración Avanzada

### Proxy para Desarrollo
Crear `proxy.conf.json`:
```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Ejecutar con proxy:
```bash
ng serve --proxy-config proxy.conf.json
```

### Optimizaciones
- Lazy loading de módulos
- OnPush change detection
- TrackBy functions para listas
- Minificación y tree-shaking

## 📊 Performance

### Métricas Objetivo
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Time to Interactive: < 4s
- Bundle size: < 2MB

### Optimizaciones Implementadas
- Angular Universal para SSR
- Service Workers para PWA
- Compression gzip/brotli
- CDN para assets estáticos

## 🐛 Debugging

### Angular DevTools
- Instalar extensión del navegador
- Inspeccionar componentes y servicios
- Profiling de performance

### Console Logs
```typescript
// Desarrollo
if (!environment.production) {
  console.log('Debug info:', data);
}
```

## 🤝 Contribución

### Estándares de Código
- ESLint + Prettier configurados
- Conventional Commits
- Husky pre-commit hooks

### Pull Request Process
1. Fork del repositorio
2. Crear rama feature
3. Implementar cambios
4. Tests passing
5. Code review
6. Merge a main

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

- Email: soporte@seismic-platform.com
- Documentación: [Wiki del proyecto]
- Issues: [GitHub Issues]

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- Implementación inicial con Angular 17
- Integración completa con Mapbox
- Dashboard en tiempo real
- Sistema de autenticación JWT
- Responsive design completo
