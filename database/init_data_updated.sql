-- =====================================================
-- DATOS INICIALES PARA SEISMIC PLATFORM
-- Ejecutar después de schema_updated.sql
-- Respeta la estructura original con gestión de usuarios
-- =====================================================

-- Usar base de datos
USE seismic_platform;

-- =====================================================
-- INSERTAR ROLES DEL SISTEMA
-- =====================================================
INSERT INTO role (id, name, description) VALUES 
(1, 'ADMIN', 'Administrador del sistema - Acceso completo a todas las estaciones y funcionalidades'),
(2, 'OPERATOR', 'Operador de monitoreo - Acceso a estaciones asignadas con permisos de lectura/escritura'),
(3, 'VIEWER', 'Visualizador de datos - Acceso de solo lectura a estaciones asignadas'),
(4, 'STATION_MANAGER', 'Gestor de estación - Administra una o varias estaciones específicas');

-- =====================================================
-- INSERTAR USUARIOS DEL SISTEMA
-- =====================================================
-- Usuario administrador principal
INSERT INTO user (id, username, email, password, first_name, last_name, phone, is_active, created_at) VALUES 
(1, 'admin', 'admin@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Administrador', 'Sistema', '+57-300-1234567', true, NOW());

-- Usuarios operadores
INSERT INTO user (id, username, email, password, first_name, last_name, phone, is_active, created_at) VALUES 
(2, 'operator_manizales', 'operator.manizales@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Juan Carlos', 'Rodríguez', '+57-300-2345678', true, NOW()),
(3, 'operator_caldas', 'operator.caldas@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'María Elena', 'González', '+57-300-3456789', true, NOW());

-- Usuarios visualizadores
INSERT INTO user (id, username, email, password, first_name, last_name, phone, is_active, created_at) VALUES 
(4, 'viewer_universidad', 'viewer.universidad@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Dr. Carlos', 'Pérez', '+57-300-4567890', true, NOW()),
(5, 'viewer_alcaldia', 'viewer.alcaldia@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ing. Ana', 'Martínez', '+57-300-5678901', true, NOW());

-- Gestor de estación
INSERT INTO user (id, username, email, password, first_name, last_name, phone, is_active, created_at) VALUES 
(6, 'manager_centro', 'manager.centro@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Luis Fernando', 'Vargas', '+57-300-6789012', true, NOW());

-- =====================================================
-- ASIGNAR ROLES A USUARIOS
-- =====================================================
INSERT INTO user_role (user_id, role_id, assigned_by) VALUES 
(1, 1, 1), -- admin -> ADMIN
(2, 2, 1), -- operator_manizales -> OPERATOR
(3, 2, 1), -- operator_caldas -> OPERATOR
(4, 3, 1), -- viewer_universidad -> VIEWER
(5, 3, 1), -- viewer_alcaldia -> VIEWER
(6, 4, 1); -- manager_centro -> STATION_MANAGER

-- =====================================================
-- INSERTAR TIPOS DE SENSOR
-- =====================================================
INSERT INTO tipo_sensor (id_tipo_sensor, nombre, unidad) VALUES 
(1, 'Acelerómetro', 'm/s²'),
(2, 'Velocímetro', 'm/s'),
(3, 'Desplazómetro', 'm');

-- =====================================================
-- INSERTAR TIPOS DE CANAL
-- =====================================================
INSERT INTO tipo_canal (id_tipo_canal, codigo, descripcion) VALUES 
(1, 'Z', 'Canal vertical Z'),
(2, 'N', 'Canal horizontal Norte-Sur'),
(3, 'E', 'Canal horizontal Este-Oeste');

-- =====================================================
-- INSERTAR COMPONENTES
-- =====================================================
INSERT INTO componente (id_componente, nombre, descripcion) VALUES 
(1, 'Z', 'Componente vertical'),
(2, 'N', 'Componente norte'),
(3, 'E', 'Componente este');

-- =====================================================
-- INSERTAR ESTACIONES SÍSMICAS
-- =====================================================
INSERT INTO estacion (id, codigo, nombre, descripcion, latitud, longitud, altitud, direccion, municipio, fecha_instalacion, estado, geologia, tipo_suelo) VALUES 
(1, 'MAN001', 'Universidad Nacional', 'Estación sísmica Universidad Nacional Manizales - Campus Palogrande', 5.0703, -75.5138, 2150, 'Campus Palogrande, Universidad Nacional', 'Manizales', '2024-01-15', 1, 'Formación volcánica cuaternaria', 'Ceniza volcánica compactada'),
(2, 'MAN002', 'Centro Histórico', 'Estación sísmica Centro Histórico Manizales - Plaza de Bolívar', 5.0689, -75.5174, 2153, 'Carrera 23 con Calle 31, Centro', 'Manizales', '2024-02-01', 1, 'Depósitos volcánicos', 'Suelo residual volcánico'),
(3, 'MAN003', 'Zona Norte', 'Estación sísmica Zona Norte - Sector Milán', 5.0803, -75.5098, 2180, 'Barrio Milán, Zona Norte', 'Manizales', '2024-03-10', 1, 'Cenizas volcánicas', 'Suelo volcánico'),
(4, 'MAN004', 'Zona Sur', 'Estación sísmica Zona Sur - La Sultana', 5.0603, -75.5238, 2100, 'Barrio La Sultana, Zona Sur', 'Manizales', '2024-04-05', 1, 'Depósitos aluviales', 'Suelo mixto'),
(5, 'VIL001', 'Villamaría Centro', 'Estación sísmica Villamaría - Parque Principal', 5.0372, -75.5131, 1925, 'Parque Principal, Villamaría', 'Villamaría', '2024-05-20', 1, 'Formación volcánica', 'Ceniza volcánica');

-- =====================================================
-- ASOCIAR USUARIOS CON ESTACIONES
-- =====================================================
-- Admin tiene acceso a todas las estaciones (no necesita asociaciones específicas)

-- Operador Manizales: Estaciones MAN001, MAN002, MAN003
INSERT INTO user_estacion (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(2, 1, 1, NOW()), -- operator_manizales -> Universidad Nacional
(2, 2, 1, NOW()), -- operator_manizales -> Centro Histórico  
(2, 3, 1, NOW()); -- operator_manizales -> Zona Norte

-- Operador Caldas: Estaciones MAN004, VIL001
INSERT INTO user_estacion (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(3, 4, 1, NOW()), -- operator_caldas -> Zona Sur
(3, 5, 1, NOW()); -- operator_caldas -> Villamaría

-- Viewer Universidad: Solo estación Universidad Nacional
INSERT INTO user_estacion (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(4, 1, 1, NOW()); -- viewer_universidad -> Universidad Nacional

-- Viewer Alcaldía: Estaciones del centro de Manizales
INSERT INTO user_estacion (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(5, 2, 1, NOW()), -- viewer_alcaldia -> Centro Histórico
(5, 3, 1, NOW()); -- viewer_alcaldia -> Zona Norte

-- Manager Centro: Estaciones del área central
INSERT INTO user_estacion (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(6, 1, 1, NOW()), -- manager_centro -> Universidad Nacional
(6, 2, 1, NOW()); -- manager_centro -> Centro Histórico

-- =====================================================
-- INSERTAR SENSORES
-- =====================================================
INSERT INTO sensor (id_sensor, id_estacion, id_tipo_sensor, marca, modelo, descripcion, frecuencia_muestreo) VALUES 
(1, 1, 1, 'Kinemetrics', 'Episensor ES-T', 'Acelerómetro principal Universidad Nacional', 200.00),
(2, 2, 1, 'Güralp', 'CMG-5TDE', 'Acelerómetro Centro Histórico', 100.00),
(3, 3, 1, 'Nanometrics', 'Titan SMA', 'Acelerómetro Zona Norte', 250.00),
(4, 4, 1, 'Kinemetrics', 'Episensor ES-T', 'Acelerómetro Zona Sur', 200.00),
(5, 5, 1, 'Güralp', 'CMG-5TDE', 'Acelerómetro Villamaría', 100.00);

-- =====================================================
-- INSERTAR CANALES DE SENSORES
-- =====================================================
INSERT INTO canal_sensor (id_canal, id_sensor, id_tipo_canal, id_componente, descripcion) VALUES 
-- Canales Universidad Nacional
(1, 1, 1, 1, 'Canal Z - Universidad Nacional'),
(2, 1, 2, 2, 'Canal N - Universidad Nacional'),
(3, 1, 3, 3, 'Canal E - Universidad Nacional'),
-- Canales Centro Histórico
(4, 2, 1, 1, 'Canal Z - Centro Histórico'),
(5, 2, 2, 2, 'Canal N - Centro Histórico'),
(6, 2, 3, 3, 'Canal E - Centro Histórico'),
-- Canales Zona Norte
(7, 3, 1, 1, 'Canal Z - Zona Norte'),
(8, 3, 2, 2, 'Canal N - Zona Norte'),
(9, 3, 3, 3, 'Canal E - Zona Norte'),
-- Canales Zona Sur
(10, 4, 1, 1, 'Canal Z - Zona Sur'),
(11, 4, 2, 2, 'Canal N - Zona Sur'),
(12, 4, 3, 3, 'Canal E - Zona Sur'),
-- Canales Villamaría
(13, 5, 1, 1, 'Canal Z - Villamaría'),
(14, 5, 2, 2, 'Canal N - Villamaría'),
(15, 5, 3, 3, 'Canal E - Villamaría');

-- =====================================================
-- INSERTAR LECTURAS DE EJEMPLO
-- =====================================================
-- Lecturas recientes para todas las estaciones (últimas 6 horas)
INSERT INTO lectura (id_canal, tiempo, aceleracion, velocidad, desplazamiento) VALUES 
-- Universidad Nacional (Canales 1-3) - Últimas 5 horas
(1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.012, 0.003, 0.001),
(1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.008, 0.002, 0.0008),
(1, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.015, 0.004, 0.0012),
(1, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.021, 0.006, 0.0018),
(1, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.009, 0.002, 0.0007),

(2, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.011, 0.003, 0.0009),
(2, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.007, 0.002, 0.0006),
(2, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.013, 0.004, 0.0011),
(2, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.019, 0.005, 0.0016),
(2, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.008, 0.002, 0.0006),

(3, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.010, 0.003, 0.0008),
(3, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.006, 0.002, 0.0005),
(3, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.014, 0.004, 0.0012),
(3, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.018, 0.005, 0.0015),
(3, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.007, 0.002, 0.0005),

-- Centro Histórico (Canales 4-6)
(4, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.013, 0.004, 0.0010),
(4, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.009, 0.003, 0.0008),
(4, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.016, 0.005, 0.0013),

(5, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.012, 0.004, 0.0009),
(5, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.008, 0.003, 0.0007),
(5, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.015, 0.005, 0.0012),

(6, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.011, 0.003, 0.0009),
(6, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.007, 0.002, 0.0006),
(6, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.014, 0.004, 0.0011),

-- Zona Norte (Canales 7-9)
(7, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.014, 0.004, 0.0011),
(8, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.013, 0.004, 0.0010),
(9, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.012, 0.003, 0.0009),

-- Zona Sur (Canales 10-12)
(10, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.015, 0.005, 0.0012),
(11, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.014, 0.004, 0.0011),
(12, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.013, 0.004, 0.0010),

-- Villamaría (Canales 13-15)
(13, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.016, 0.005, 0.0013),
(14, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.015, 0.005, 0.0012),
(15, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.014, 0.004, 0.0011);

-- =====================================================
-- COMENTARIOS SOBRE EL SISTEMA DE PERMISOS
-- =====================================================
/*
SISTEMA DE PERMISOS POR ROLES:

1. ADMIN (ID: 1)
   - Acceso completo a todas las estaciones
   - Puede ver y gestionar todos los sensores
   - No requiere asociaciones específicas en user_estacion

2. OPERATOR (ID: 2) 
   - Acceso a estaciones asignadas en user_estacion
   - Puede ver y operar sensores de sus estaciones
   - Permisos de lectura/escritura

3. VIEWER (ID: 3)
   - Acceso de solo lectura a estaciones asignadas
   - Puede ver sensores pero no modificar

4. STATION_MANAGER (ID: 4)
   - Gestiona estaciones específicas asignadas
   - Permisos administrativos sobre sus estaciones

IMPLEMENTACIÓN EN BACKEND:
- Verificar rol del usuario en cada endpoint
- Si es ADMIN: acceso completo
- Si no es ADMIN: consultar user_estacion para obtener estaciones permitidas
- Filtrar sensores por estaciones permitidas

ESTRUCTURA RESPETADA:
- Mantiene nombres de tablas y campos originales
- Agrega gestión de usuarios sin modificar estructura sísmica
- Compatible con entidades JPA existentes
*/
