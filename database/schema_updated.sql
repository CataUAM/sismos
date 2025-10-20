-- =====================================================
-- SEISMIC PLATFORM DATABASE SCHEMA
-- Sistema de Monitoreo Sísmico con Gestión de Usuarios
-- Basado en el esquema original con extensiones de usuarios
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS seismic_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE seismic_platform;

-- =====================================================
-- TABLAS DE GESTIÓN DE USUARIOS Y ROLES (NUEVAS)
-- =====================================================

-- Tabla de roles del sistema
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE user (
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
CREATE TABLE user_role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES user(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- Tabla de asociación usuarios-estaciones (muchos a muchos)
CREATE TABLE user_estacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    estacion_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (estacion_id) REFERENCES estacion(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES user(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_estacion (user_id, estacion_id),
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_estacion_active (estacion_id, is_active)
);

-- =====================================================
-- TABLAS ORIGINALES DEL SISTEMA SÍSMICO
-- =====================================================

-- Tabla de tipos de sensor
CREATE TABLE tipo_sensor (
    id_tipo_sensor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    unidad VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tipos de canal
CREATE TABLE tipo_canal (
    id_tipo_canal INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(3) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de componentes
CREATE TABLE componente (
    id_componente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(1) NOT NULL UNIQUE,
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
    estado TINYINT DEFAULT 1 COMMENT '0=Inactiva, 1=Activa, 2=Mantenimiento',
    geologia TEXT,
    tipo_suelo VARCHAR(100),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado),
    INDEX idx_ubicacion (latitud, longitud)
);

-- Tabla de sensores
CREATE TABLE sensor (
    id_sensor INT PRIMARY KEY AUTO_INCREMENT,
    id_estacion INT NOT NULL,
    id_tipo_sensor INT NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    descripcion TEXT,
    frecuencia_muestreo DECIMAL(6, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_sensor) REFERENCES tipo_sensor(id_tipo_sensor),
    FOREIGN KEY (id_estacion) REFERENCES estacion(id) ON DELETE CASCADE,
    INDEX idx_estacion (id_estacion),
    INDEX idx_tipo_sensor (id_tipo_sensor)
);

-- Tabla de canales de sensores
CREATE TABLE canal_sensor (
    id_canal INT PRIMARY KEY AUTO_INCREMENT,
    id_sensor INT NOT NULL,
    id_tipo_canal INT NOT NULL,
    id_componente INT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sensor) REFERENCES sensor(id_sensor) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_canal) REFERENCES tipo_canal(id_tipo_canal),
    FOREIGN KEY (id_componente) REFERENCES componente(id_componente),
    INDEX idx_sensor (id_sensor),
    INDEX idx_tipo_canal (id_tipo_canal),
    INDEX idx_componente (id_componente)
);

-- Tabla de lecturas sísmicas
CREATE TABLE lectura (
    id_lectura BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_canal INT NOT NULL,
    tiempo TIMESTAMP(3) NOT NULL,
    aceleracion FLOAT,
    velocidad FLOAT,
    desplazamiento FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_canal) REFERENCES canal_sensor(id_canal) ON DELETE CASCADE,
    INDEX idx_canal_tiempo (id_canal, tiempo),
    INDEX idx_tiempo (tiempo),
    UNIQUE KEY unique_canal_tiempo (id_canal, tiempo)
);

-- Tabla de gráficas (para compatibilidad con entidades)
CREATE TABLE grafica (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_sensor INT NOT NULL,
    nombre VARCHAR(200),
    tipo VARCHAR(50),
    configuracion JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sensor) REFERENCES sensor(id_sensor) ON DELETE CASCADE,
    INDEX idx_sensor (id_sensor)
);

-- =====================================================
-- TABLAS DE AUDITORÍA Y LOGS
-- =====================================================

-- Tabla de notificaciones de usuario
CREATE TABLE user_notification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created_at (created_at)
);

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
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
    INDEX idx_user_action (user_id, action),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_created_at (created_at)
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
FROM user u
LEFT JOIN user_role ur ON u.id = ur.user_id
LEFT JOIN role r ON ur.role_id = r.id
GROUP BY u.id;

-- Vista de estaciones con información completa
CREATE VIEW v_estaciones_completas AS
SELECT 
    e.*,
    COUNT(DISTINCT s.id_sensor) as total_sensores,
    COUNT(DISTINCT CASE WHEN s.id_sensor IS NOT NULL THEN s.id_sensor END) as sensores_activos
FROM estacion e
LEFT JOIN sensor s ON e.id = s.id_estacion
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
    e.estado as estacion_activa,
    ue.assigned_at,
    ue.is_active as assignment_active
FROM user u
JOIN user_estacion ue ON u.id = ue.user_id
JOIN estacion e ON ue.estacion_id = e.id
WHERE ue.is_active = true;
