# Plataforma Sísmica Manizales - Backend

Backend desarrollado en Java 17 con Spring Boot 3.2 para la plataforma de monitoreo sísmico de Manizales.

## 🚀 Características

- **Java 17 LTS** con Spring Boot 3.2
- **Autenticación JWT** con Spring Security
- **Base de datos MySQL 8.0** con JPA/Hibernate
- **WebSocket** para datos en tiempo real
- **Sistema de notificaciones** (Email/WhatsApp)
- **API REST** completa para gestión de estaciones y lecturas
- **Documentación automática** con Swagger/OpenAPI

## 📋 Prerrequisitos

- Java 17 o superior
- Maven 3.8+
- MySQL 8.0
- IDE compatible (IntelliJ IDEA, Eclipse, VS Code)

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd seismic-platform-backend
```

### 2. Configurar la base de datos

Crear base de datos en MySQL:
```sql
CREATE DATABASE seismic_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'seismic_user'@'localhost' IDENTIFIED BY 'seismic_password';
GRANT ALL PRIVILEGES ON seismic_db.* TO 'seismic_user'@'localhost';
FLUSH PRIVILEGES;
```

Ejecutar scripts de creación de tablas:
```sql
-- Ejecutar el contenido de src/main/resources/db/migration/V1__create_user_tables.sql
-- Luego ejecutar el script de tablas sísmicas proporcionado en la documentación
```

### 3. Configurar variables de entorno

Crear archivo `.env` o configurar variables del sistema:
```bash
DB_USERNAME=seismic_user
DB_PASSWORD=seismic_password
JWT_SECRET=mySecretKey123456789012345678901234567890
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
WHATSAPP_API_URL=https://api.whatsapp.com/send
WHATSAPP_TOKEN=your-whatsapp-token
MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### 4. Compilar y ejecutar

```bash
# Compilar el proyecto
mvn clean compile

# Ejecutar tests
mvn test

# Ejecutar la aplicación
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080/api`

## 📚 API Endpoints

### Autenticación
- `POST /auth/signin` - Iniciar sesión
- `POST /auth/refresh` - Renovar token

### Estaciones
- `GET /estaciones/public/mapa` - Estaciones para mapa (público)
- `GET /estaciones` - Listar todas las estaciones
- `GET /estaciones/activas` - Estaciones activas
- `GET /estaciones/{id}` - Obtener estación por ID
- `POST /estaciones` - Crear estación (Admin)
- `PUT /estaciones/{id}` - Actualizar estación (Admin)

### Lecturas
- `GET /lecturas/recientes` - Lecturas recientes
- `GET /lecturas/estacion/{id}` - Lecturas por estación
- `GET /lecturas/tiempo-real` - Datos en tiempo real
- `POST /lecturas` - Crear lectura (Operador)
- `POST /lecturas/batch` - Crear múltiples lecturas

### WebSocket
- Endpoint: `/ws`
- Tópicos:
  - `/topic/lecturas` - Lecturas individuales
  - `/topic/lecturas/batch` - Lotes de lecturas

## 🔧 Configuración

### application.yml
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/seismic_db?useSSL=false&serverTimezone=UTC
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  
  security:
    jwt:
      secret: ${JWT_SECRET:mySecretKey}
      expiration: 86400000 # 24 hours
```

## 👥 Roles y Permisos

- **ADMIN**: Acceso completo al sistema
- **OPERATOR**: Gestión de lecturas y monitoreo
- **VIEWER**: Solo lectura de datos

## 🔐 Seguridad

- Autenticación JWT con tokens de acceso y renovación
- Encriptación de contraseñas con BCrypt
- CORS configurado para frontend
- Validación de entrada en todos los endpoints

## 📊 Monitoreo

- Logs estructurados con Logback
- Métricas de aplicación con Actuator
- WebSocket para datos en tiempo real
- Sistema de alertas automáticas

## 🚨 Sistema de Notificaciones

### Email
Configurar SMTP en `application.yml`:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
```

### WhatsApp
Integración con API de WhatsApp para alertas críticas.

## 🧪 Testing

```bash
# Ejecutar todos los tests
mvn test

# Ejecutar tests de integración
mvn verify

# Generar reporte de cobertura
mvn jacoco:report
```

## 📦 Deployment

### Desarrollo
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Producción
```bash
# Crear JAR
mvn clean package -Pproduction

# Ejecutar
java -jar target/seismic-platform-backend-0.0.1-SNAPSHOT.jar
```

### Docker
```dockerfile
FROM openjdk:17-jre-slim
COPY target/seismic-platform-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico, contactar:
- Email: soporte@seismic-platform.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- Implementación inicial del backend
- Sistema de autenticación JWT
- API REST completa
- WebSocket para tiempo real
- Sistema de notificaciones
