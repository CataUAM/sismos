# 🚀 Guía de Instalación - Plataforma Sísmica Manizales

## ✅ Estado Actual de Prerrequisitos

- ✅ **Node.js 20.10.0** - Instalado y listo
- ❌ **Java 17+** - Necesita instalación
- ❌ **Maven 3.8+** - Necesita instalación  
- ❌ **MySQL 8.0+** - Necesita instalación

## 📦 Instalación de Prerrequisitos Faltantes

### 1. Instalar Java 17 (OpenJDK)

```bash
# Opción 1: Descargar desde Eclipse Temurin (Recomendado)
# Ir a: https://adoptium.net/temurin/releases/
# Descargar: OpenJDK 17 LTS para Windows x64 (.msi)

# Opción 2: Usar Chocolatey (si está instalado)
choco install openjdk17

# Opción 3: Usar winget
winget install EclipseAdoptium.Temurin.17.JDK
```

### 2. Instalar Maven

```bash
# Opción 1: Descargar manualmente
# Ir a: https://maven.apache.org/download.cgi
# Descargar: apache-maven-3.9.x-bin.zip
# Extraer en C:\Program Files\Apache\maven
# Agregar C:\Program Files\Apache\maven\bin al PATH

# Opción 2: Usar Chocolatey
choco install maven

# Opción 3: Usar winget
winget install Apache.Maven
```

### 3. Instalar MySQL 8.0

```bash
# Opción 1: MySQL Installer (Recomendado)
# Ir a: https://dev.mysql.com/downloads/installer/
# Descargar: mysql-installer-community-8.0.x.x.msi

# Opción 2: Usar Chocolatey
choco install mysql

# Durante la instalación:
# - Configurar contraseña de root
# - Habilitar MySQL como servicio de Windows
# - Puerto por defecto: 3306
```

## 🔧 Configuración de Variables de Entorno

Después de instalar Java y Maven, verificar que estén en el PATH:

```cmd
# Verificar instalaciones
java -version
mvn -version
mysql --version
```

Si no funcionan, agregar manualmente al PATH:
- Java: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\bin`
- Maven: `C:\Program Files\Apache\maven\bin`
- MySQL: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

## 🗄️ Configuración de Base de Datos

1. **Ejecutar script de configuración:**
   ```cmd
   cd C:\Users\Anpipe12\Documents\seismic-platform
   scripts\setup-database.bat
   ```

2. **Configuración manual (alternativa):**
   ```sql
   -- Conectar a MySQL como root
   mysql -u root -p
   
   -- Crear base de datos
   CREATE DATABASE seismic_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   
   -- Crear usuario
   CREATE USER 'seismic_user'@'localhost' IDENTIFIED BY 'seismic_pass123';
   GRANT ALL PRIVILEGES ON seismic_platform.* TO 'seismic_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## 🚀 Ejecución de la Aplicación

### Opción 1: Ejecutar Todo Automáticamente
```cmd
cd C:\Users\Anpipe12\Documents\seismic-platform
scripts\start-all.bat
```

### Opción 2: Ejecutar por Separado

**Backend (Terminal 1):**
```cmd
cd C:\Users\Anpipe12\Documents\seismic-platform
scripts\start-backend.bat
```

**Frontend (Terminal 2):**
```cmd
cd C:\Users\Anpipe12\Documents\seismic-platform
scripts\start-frontend.bat
```

## 🌐 URLs de Acceso

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/swagger-ui.html

## 🔐 Credenciales de Acceso

- **Usuario:** admin
- **Contraseña:** admin123

## 🔧 Variables de Entorno (Opcionales)

Crear archivo `.env` en la carpeta backend para personalizar:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=seismic_platform
DB_USERNAME=seismic_user
DB_PASSWORD=seismic_pass123

# JWT
JWT_SECRET=mySecretKey
JWT_EXPIRATION=86400

# Email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# WhatsApp API (opcional)
WHATSAPP_API_URL=https://api.whatsapp.com
WHATSAPP_TOKEN=your-token

# Mapbox (requerido para frontend)
MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

## 🐛 Solución de Problemas Comunes

### Error: "Java no encontrado"
- Verificar que Java 17+ esté instalado
- Verificar que JAVA_HOME esté configurado
- Reiniciar terminal después de la instalación

### Error: "Maven no encontrado"
- Verificar instalación de Maven
- Verificar que Maven esté en el PATH
- Reiniciar terminal

### Error de conexión a MySQL
- Verificar que MySQL esté ejecutándose como servicio
- Verificar credenciales de base de datos
- Verificar que el puerto 3306 esté disponible

### Error en frontend: "npm install failed"
- Limpiar caché: `npm cache clean --force`
- Eliminar node_modules: `rmdir /s node_modules`
- Reinstalar: `npm install`

### Error de Mapbox
- Obtener token gratuito en: https://www.mapbox.com/
- Configurar en `frontend/src/environments/environment.ts`

## 📞 Soporte

Si encuentras problemas, verifica:
1. Todos los prerrequisitos están instalados
2. Variables de entorno configuradas correctamente
3. Base de datos creada y accesible
4. Puertos 8080 y 4200 disponibles
