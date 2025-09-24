-- =====================================================
-- SEISMIC PLATFORM DATABASE SCHEMA
-- Sistema de Monitoreo Sísmico con Gestión de Usuarios
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS seismic_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE seismic_platform;

-- =====================================================
-- TABLAS DE GESTIÓN DE USUARIOS Y ROLES
-- =====================================================

-- Tabla de roles del sistema
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- Tabla de relación usuarios-roles (muchos a muchos)
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- =====================================================
-- TABLAS DEL SISTEMA SÍSMICO
-- =====================================================

-- Tabla de tipos de sensor
CREATE TABLE tipo_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    unidad_medida VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tipos de canal
CREATE TABLE tipo_canal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de componentes
CREATE TABLE componente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(10) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estaciones sísmicas
CREATE TABLE estacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    altitud DECIMAL(8, 2),
    direccion TEXT,
    municipio VARCHAR(100),
    departamento VARCHAR(100) DEFAULT 'Caldas',
    pais VARCHAR(100) DEFAULT 'Colombia',
    fecha_instalacion DATE,
    fecha_ultima_calibracion DATE,
    activa BOOLEAN DEFAULT true,
    geologia TEXT,
    tipo_suelo VARCHAR(100),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_activa (activa),
    INDEX idx_ubicacion (latitud, longitud)
);

-- Tabla de asociación usuarios-estaciones (muchos a muchos)
CREATE TABLE user_estaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    estacion_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_estacion (user_id, estacion_id),
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_estacion_active (estacion_id, is_active)
);

-- Tabla de acelerógrafos
CREATE TABLE acelerografo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),
    estacion_id INT NOT NULL,
    ubicacion_especifica TEXT,
    fecha_instalacion DATE,
    fecha_ultima_calibracion DATE,
    estado TINYINT DEFAULT 1 COMMENT '0=Inactivo, 1=Activo, 2=Mantenimiento',
    activo BOOLEAN DEFAULT true,
    descripcion TEXT,
    frecuencia_muestreo INT COMMENT 'Hz',
    rango_medicion DECIMAL(8, 4) COMMENT 'g',
    resolucion INT COMMENT 'bits',
    tipo_sensor VARCHAR(50),
    responsable VARCHAR(200),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE CASCADE,
    INDEX idx_codigo (codigo),
    INDEX idx_estacion (estacion_id),
    INDEX idx_estado (estado, activo)
);

-- Tabla de sensores
CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    tipo_sensor_id INT NOT NULL,
    estacion_id INT NOT NULL,
    acelerografo_id INT,
    fecha_instalacion DATE,
    activo BOOLEAN DEFAULT true,
    configuracion JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_sensor_id) REFERENCES tipo_sensor(id),
    FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE CASCADE,
    FOREIGN KEY (acelerografo_id) REFERENCES acelerografo(id) ON DELETE SET NULL,
    INDEX idx_codigo (codigo),
    INDEX idx_estacion (estacion_id),
    INDEX idx_activo (activo)
);

-- Tabla de canales de sensores
CREATE TABLE canal_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    sensor_id INT NOT NULL,
    tipo_canal_id INT NOT NULL,
    componente_id INT NOT NULL,
    factor_conversion DECIMAL(10, 6) DEFAULT 1.0,
    activo BOOLEAN DEFAULT true,
    configuracion JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES sensor(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_canal_id) REFERENCES tipo_canal(id),
    FOREIGN KEY (componente_id) REFERENCES componente(id),
    INDEX idx_codigo (codigo),
    INDEX idx_sensor (sensor_id),
    INDEX idx_activo (activo)
);

-- Tabla de lecturas sísmicas
CREATE TABLE lectura (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    canal_sensor_id INT NOT NULL,
    tiempo TIMESTAMP(3) NOT NULL,
    aceleracion DECIMAL(12, 8),
    velocidad DECIMAL(12, 8),
    desplazamiento DECIMAL(12, 8),
    calidad TINYINT DEFAULT 1 COMMENT '1=Buena, 2=Regular, 3=Mala',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (canal_sensor_id) REFERENCES canal_sensor(id) ON DELETE CASCADE,
    INDEX idx_canal_tiempo (canal_sensor_id, tiempo),
    INDEX idx_tiempo (tiempo),
    INDEX idx_calidad (calidad)
);

-- =====================================================
-- TABLAS DE AUDITORÍA Y LOGS
-- =====================================================

-- Tabla de auditoría de acciones de usuarios
CREATE TABLE user_audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_action (user_id, action),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_created_at (created_at)
);

-- Tabla de sesiones de usuario
CREATE TABLE user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_last_activity (last_activity)
);

-- =====================================================
-- VISTAS PARA CONSULTAS OPTIMIZADAS
-- =====================================================

-- Vista de usuarios con sus roles
CREATE VIEW v_users_with_roles AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.is_active,
    u.last_login,
    u.created_at,
    GROUP_CONCAT(r.name ORDER BY r.name) as roles,
    GROUP_CONCAT(r.id ORDER BY r.name) as role_ids
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id;

-- Vista de estaciones con información completa
CREATE VIEW v_estaciones_completas AS
SELECT 
    e.*,
    COUNT(DISTINCT s.id) as total_sensores,
    COUNT(DISTINCT a.id) as total_acelerografos,
    COUNT(DISTINCT CASE WHEN s.activo = true THEN s.id END) as sensores_activos,
    COUNT(DISTINCT CASE WHEN a.activo = true THEN a.id END) as acelerografos_activos
FROM estacion e
LEFT JOIN sensor s ON e.id = s.estacion_id
LEFT JOIN acelerografo a ON e.id = a.estacion_id
GROUP BY e.id;

-- Vista de usuarios con sus estaciones asignadas
CREATE VIEW v_users_estaciones AS
SELECT 
    u.id as user_id,
    u.username,
    u.first_name,
    u.last_name,
    ue.estacion_id,
    e.codigo as estacion_codigo,
    e.nombre as estacion_nombre,
    e.activa as estacion_activa,
    ue.assigned_at,
    ue.is_active as assignment_active
FROM users u
JOIN user_estaciones ue ON u.id = ue.user_id
JOIN estacion e ON ue.estacion_id = e.id
WHERE ue.is_active = true;
