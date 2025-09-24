-- =====================================================
-- DATOS INICIALES PARA SEISMIC PLATFORM
-- Ejecutar después de schema.sql
-- =====================================================

-- Usar base de datos
USE seismic_platform;

-- =====================================================
-- INSERTAR ROLES DEL SISTEMA
-- =====================================================
INSERT INTO roles (id, name, description) VALUES 
(1, 'ADMIN', 'Administrador del sistema - Acceso completo a todas las estaciones y funcionalidades'),
(2, 'OPERATOR', 'Operador de monitoreo - Acceso a estaciones asignadas con permisos de lectura/escritura'),
(3, 'VIEWER', 'Visualizador de datos - Acceso de solo lectura a estaciones asignadas'),
(4, 'STATION_MANAGER', 'Gestor de estación - Administra una o varias estaciones específicas');

-- =====================================================
-- INSERTAR USUARIOS DEL SISTEMA
-- =====================================================
-- Usuario administrador principal
INSERT INTO users (id, username, email, password, first_name, last_name, phone, is_active, created_at) VALUES 
(1, 'admin', 'admin@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Administrador', 'Sistema', '+57-300-1234567', true, NOW());

-- Usuarios operadores
INSERT INTO users (id, username, email, password, first_name, last_name, phone, is_active, created_at) VALUES 
(2, 'operator_manizales', 'operator.manizales@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Juan Carlos', 'Rodríguez', '+57-300-2345678', true, NOW()),
(3, 'operator_caldas', 'operator.caldas@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'María Elena', 'González', '+57-300-3456789', true, NOW());

-- Usuarios visualizadores
INSERT INTO users (id, username, email, password, first_name, last_name, phone, is_active, created_at) VALUES 
(4, 'viewer_universidad', 'viewer.universidad@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Dr. Carlos', 'Pérez', '+57-300-4567890', true, NOW()),
(5, 'viewer_alcaldia', 'viewer.alcaldia@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Ing. Ana', 'Martínez', '+57-300-5678901', true, NOW());

-- Gestor de estación
INSERT INTO users (id, username, email, password, first_name, last_name, phone, is_active, created_at) VALUES 
(6, 'manager_centro', 'manager.centro@seismic.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Luis Fernando', 'Vargas', '+57-300-6789012', true, NOW());

-- =====================================================
-- ASIGNAR ROLES A USUARIOS
-- =====================================================
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES 
(1, 1, 1), -- admin -> ADMIN
(2, 2, 1), -- operator_manizales -> OPERATOR
(3, 2, 1), -- operator_caldas -> OPERATOR
(4, 3, 1), -- viewer_universidad -> VIEWER
(5, 3, 1), -- viewer_alcaldia -> VIEWER
(6, 4, 1); -- manager_centro -> STATION_MANAGER

-- Insertar tipos de sensor
INSERT INTO tipo_sensor (id, nombre, descripcion, unidad_medida) VALUES 
(1, 'Acelerómetro', 'Sensor de aceleración sísmica', 'm/s²'),
(2, 'Velocímetro', 'Sensor de velocidad sísmica', 'm/s'),
(3, 'Desplazómetro', 'Sensor de desplazamiento sísmico', 'm');

-- Insertar tipos de canal
INSERT INTO tipo_canal (id, nombre, descripcion) VALUES 
(1, 'Vertical', 'Canal vertical Z'),
(2, 'Norte-Sur', 'Canal horizontal N-S'),
(3, 'Este-Oeste', 'Canal horizontal E-W');

-- Insertar componentes
INSERT INTO componente (id, nombre, descripcion) VALUES 
(1, 'Z', 'Componente vertical'),
(2, 'N', 'Componente norte'),
(3, 'E', 'Componente este');

-- =====================================================
-- INSERTAR ESTACIONES SÍSMICAS
-- =====================================================
INSERT INTO estacion (id, codigo, nombre, descripcion, latitud, longitud, altitud, direccion, municipio, fecha_instalacion, activa, geologia, tipo_suelo) VALUES 
(1, 'MAN001', 'Universidad Nacional', 'Estación sísmica Universidad Nacional Manizales - Campus Palogrande', 5.0703, -75.5138, 2150, 'Campus Palogrande, Universidad Nacional', 'Manizales', '2024-01-15', true, 'Formación volcánica cuaternaria', 'Ceniza volcánica compactada'),
(2, 'MAN002', 'Centro Histórico', 'Estación sísmica Centro Histórico Manizales - Plaza de Bolívar', 5.0689, -75.5174, 2153, 'Carrera 23 con Calle 31, Centro', 'Manizales', '2024-02-01', true, 'Depósitos volcánicos', 'Suelo residual volcánico'),
(3, 'MAN003', 'Zona Norte', 'Estación sísmica Zona Norte - Sector Milán', 5.0803, -75.5098, 2180, 'Barrio Milán, Zona Norte', 'Manizales', '2024-03-10', true, 'Cenizas volcánicas', 'Suelo volcánico'),
(4, 'MAN004', 'Zona Sur', 'Estación sísmica Zona Sur - La Sultana', 5.0603, -75.5238, 2100, 'Barrio La Sultana, Zona Sur', 'Manizales', '2024-04-05', true, 'Depósitos aluviales', 'Suelo mixto'),
(5, 'VIL001', 'Villamaría Centro', 'Estación sísmica Villamaría - Parque Principal', 5.0372, -75.5131, 1925, 'Parque Principal, Villamaría', 'Villamaría', '2024-05-20', true, 'Formación volcánica', 'Ceniza volcánica');

-- =====================================================
-- ASOCIAR USUARIOS CON ESTACIONES
-- =====================================================
-- Admin tiene acceso a todas las estaciones (no necesita asociaciones específicas)

-- Operador Manizales: Estaciones MAN001, MAN002, MAN003
INSERT INTO user_estaciones (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(2, 1, 1, NOW()), -- operator_manizales -> Universidad Nacional
(2, 2, 1, NOW()), -- operator_manizales -> Centro Histórico  
(2, 3, 1, NOW()); -- operator_manizales -> Zona Norte

-- Operador Caldas: Estaciones MAN004, VIL001
INSERT INTO user_estaciones (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(3, 4, 1, NOW()), -- operator_caldas -> Zona Sur
(3, 5, 1, NOW()); -- operator_caldas -> Villamaría

-- Viewer Universidad: Solo estación Universidad Nacional
INSERT INTO user_estaciones (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(4, 1, 1, NOW()); -- viewer_universidad -> Universidad Nacional

-- Viewer Alcaldía: Estaciones del centro de Manizales
INSERT INTO user_estaciones (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(5, 2, 1, NOW()), -- viewer_alcaldia -> Centro Histórico
(5, 3, 1, NOW()); -- viewer_alcaldia -> Zona Norte

-- Manager Centro: Estaciones del área central
INSERT INTO user_estaciones (user_id, estacion_id, assigned_by, assigned_at) VALUES 
(6, 1, 1, NOW()), -- manager_centro -> Universidad Nacional
(6, 2, 1, NOW()); -- manager_centro -> Centro Histórico

-- =====================================================
-- INSERTAR ACELERÓGRAFOS
-- =====================================================
INSERT INTO acelerografo (id, codigo, nombre, marca, modelo, numero_serie, estacion_id, ubicacion_especifica, fecha_instalacion, fecha_ultima_calibracion, estado, activo, descripcion, frecuencia_muestreo, rango_medicion, resolucion, tipo_sensor, responsable) VALUES 
(1, 'ACL-001', 'Acelerógrafo Centro UN', 'Kinemetrics', 'Episensor ES-T', 'KIN-2024-001', 1, 'Edificio de Ingeniería, Planta Baja', '2024-01-15', '2024-01-15', 1, true, 'Acelerógrafo principal Universidad Nacional', 200, 2.0, 24, 'Triaxial', 'Dr. Carlos Pérez'),
(2, 'ACL-002', 'Acelerógrafo Centro Histórico', 'Güralp', 'CMG-5TDE', 'GUR-2024-002', 2, 'Alcaldía Municipal, Sótano', '2024-02-01', '2024-02-20', 1, true, 'Acelerógrafo centro histórico', 100, 1.0, 24, 'Triaxial', 'Ing. Ana Martínez'),
(3, 'ACL-003', 'Acelerógrafo Norte', 'Nanometrics', 'Titan SMA', 'NAN-2024-003', 3, 'Centro Comercial Milán, Azotea', '2024-03-10', '2024-03-10', 1, true, 'Acelerógrafo zona norte', 250, 4.0, 24, 'Triaxial', 'Juan Carlos Rodríguez'),
(4, 'ACL-004', 'Acelerógrafo Sur', 'Kinemetrics', 'Episensor ES-T', 'KIN-2024-004', 4, 'Colegio La Sultana, Laboratorio', '2024-04-05', '2024-04-05', 1, true, 'Acelerógrafo zona sur', 200, 2.0, 24, 'Triaxial', 'María Elena González'),
(5, 'ACL-005', 'Acelerógrafo Villamaría', 'Güralp', 'CMG-5TDE', 'GUR-2024-005', 5, 'Casa de la Cultura, Primer Piso', '2024-05-20', '2024-05-20', 1, true, 'Acelerógrafo Villamaría centro', 100, 1.0, 24, 'Triaxial', 'Luis Fernando Vargas');

-- =====================================================
-- INSERTAR SENSORES
-- =====================================================
INSERT INTO sensor (id, codigo, nombre, tipo_sensor_id, estacion_id, acelerografo_id, fecha_instalacion, activo) VALUES 
(1, 'ACC001', 'Acelerómetro Principal UN', 1, 1, 1, '2024-01-15', true),
(2, 'ACC002', 'Acelerómetro Principal CH', 1, 2, 2, '2024-02-01', true),
(3, 'ACC003', 'Acelerómetro Norte', 1, 3, 3, '2024-03-10', true),
(4, 'ACC004', 'Acelerómetro Sur', 1, 4, 4, '2024-04-05', true),
(5, 'ACC005', 'Acelerómetro Villamaría', 1, 5, 5, '2024-05-20', true);

-- =====================================================
-- INSERTAR CANALES DE SENSORES
-- =====================================================
INSERT INTO canal_sensor (id, codigo, nombre, sensor_id, tipo_canal_id, componente_id, factor_conversion, activo) VALUES 
-- Canales Universidad Nacional
(1, 'MAN001_Z', 'Canal Z - UN', 1, 1, 1, 1.0, true),
(2, 'MAN001_N', 'Canal N - UN', 1, 2, 2, 1.0, true),
(3, 'MAN001_E', 'Canal E - UN', 1, 3, 3, 1.0, true),
-- Canales Centro Histórico
(4, 'MAN002_Z', 'Canal Z - CH', 2, 1, 1, 1.0, true),
(5, 'MAN002_N', 'Canal N - CH', 2, 2, 2, 1.0, true),
(6, 'MAN002_E', 'Canal E - CH', 2, 3, 3, 1.0, true),
-- Canales Zona Norte
(7, 'MAN003_Z', 'Canal Z - Norte', 3, 1, 1, 1.0, true),
(8, 'MAN003_N', 'Canal N - Norte', 3, 2, 2, 1.0, true),
(9, 'MAN003_E', 'Canal E - Norte', 3, 3, 3, 1.0, true),
-- Canales Zona Sur
(10, 'MAN004_Z', 'Canal Z - Sur', 4, 1, 1, 1.0, true),
(11, 'MAN004_N', 'Canal N - Sur', 4, 2, 2, 1.0, true),
(12, 'MAN004_E', 'Canal E - Sur', 4, 3, 3, 1.0, true),
-- Canales Villamaría
(13, 'VIL001_Z', 'Canal Z - Villamaría', 5, 1, 1, 1.0, true),
(14, 'VIL001_N', 'Canal N - Villamaría', 5, 2, 2, 1.0, true),
(15, 'VIL001_E', 'Canal E - Villamaría', 5, 3, 3, 1.0, true);

-- Insertar lecturas de ejemplo (últimas 24 horas)
INSERT INTO lectura (canal_sensor_id, tiempo, aceleracion, velocidad, desplazamiento) VALUES 
-- Estación UN - Canal Z
(1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.012, 0.003, 0.001),
(1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.008, 0.002, 0.0008),
(1, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.015, 0.004, 0.0012),
(1, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.021, 0.006, 0.0018),
(1, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.009, 0.002, 0.0007),

-- Estación UN - Canal N
(2, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.011, 0.003, 0.0009),
(2, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.007, 0.002, 0.0006),
(2, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.013, 0.004, 0.0011),
(2, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.019, 0.005, 0.0016),
(2, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.008, 0.002, 0.0006),

-- Estación UN - Canal E
(3, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.010, 0.003, 0.0008),
(3, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.006, 0.002, 0.0005),
(3, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.014, 0.004, 0.0012),
(3, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.018, 0.005, 0.0015),
(3, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.007, 0.002, 0.0005),

-- Estación Centro Histórico - Canal Z
(4, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.013, 0.004, 0.0010),
(4, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.009, 0.003, 0.0008),
(4, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.016, 0.005, 0.0013),
(4, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.022, 0.007, 0.0019),
(4, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.010, 0.003, 0.0008),

-- Estación Centro Histórico - Canal N
(5, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.012, 0.004, 0.0009),
(5, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.008, 0.003, 0.0007),
(5, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.015, 0.005, 0.0012),
(5, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.020, 0.006, 0.0017),
(5, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.009, 0.003, 0.0007),

-- Estación Centro Histórico - Canal E
(6, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.011, 0.003, 0.0009),
(6, DATE_SUB(NOW(), INTERVAL 2 HOUR), 0.007, 0.002, 0.0006),
(6, DATE_SUB(NOW(), INTERVAL 3 HOUR), 0.014, 0.004, 0.0011),
(6, DATE_SUB(NOW(), INTERVAL 4 HOUR), 0.019, 0.006, 0.0016),
(6, DATE_SUB(NOW(), INTERVAL 5 HOUR), 0.008, 0.002, 0.0006);

-- =====================================================
-- INSERTAR DATOS DE EJEMPLO DE LECTURAS SÍSMICAS
-- =====================================================
-- Nota: Solo se incluyen algunas lecturas de ejemplo
-- En producción, estas se generarían automáticamente por los sensores

-- Lecturas recientes para todas las estaciones (últimas 6 horas)
INSERT INTO lectura (canal_sensor_id, tiempo, aceleracion, velocidad, desplazamiento, calidad) VALUES 
-- Universidad Nacional (Canales 1-3)
(1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.012, 0.003, 0.001, 1),
(2, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.011, 0.003, 0.0009, 1),
(3, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.010, 0.003, 0.0008, 1),
-- Centro Histórico (Canales 4-6)
(4, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.013, 0.004, 0.0010, 1),
(5, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.012, 0.004, 0.0009, 1),
(6, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.011, 0.003, 0.0009, 1),
-- Zona Norte (Canales 7-9)
(7, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.014, 0.004, 0.0011, 1),
(8, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.013, 0.004, 0.0010, 1),
(9, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.012, 0.003, 0.0009, 1),
-- Zona Sur (Canales 10-12)
(10, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.015, 0.005, 0.0012, 1),
(11, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.014, 0.004, 0.0011, 1),
(12, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.013, 0.004, 0.0010, 1),
-- Villamaría (Canales 13-15)
(13, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.016, 0.005, 0.0013, 1),
(14, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.015, 0.005, 0.0012, 1),
(15, DATE_SUB(NOW(), INTERVAL 1 HOUR), 0.014, 0.004, 0.0011, 1);

-- =====================================================
-- COMENTARIOS SOBRE EL SISTEMA DE PERMISOS
-- =====================================================
/*
SISTEMA DE PERMISOS POR ROLES:

1. ADMIN (ID: 1)
   - Acceso completo a todas las estaciones
   - Puede ver y gestionar todos los acelerógrafos
   - No requiere asociaciones específicas en user_estaciones

2. OPERATOR (ID: 2) 
   - Acceso a estaciones asignadas en user_estaciones
   - Puede ver y operar acelerógrafos de sus estaciones
   - Permisos de lectura/escritura

3. VIEWER (ID: 3)
   - Acceso de solo lectura a estaciones asignadas
   - Puede ver acelerógrafos pero no modificar

4. STATION_MANAGER (ID: 4)
   - Gestiona estaciones específicas asignadas
   - Permisos administrativos sobre sus estaciones

IMPLEMENTACIÓN EN BACKEND:
- Verificar rol del usuario en cada endpoint
- Si es ADMIN: acceso completo
- Si no es ADMIN: consultar user_estaciones para obtener estaciones permitidas
- Filtrar acelerógrafos por estaciones permitidas
*/
