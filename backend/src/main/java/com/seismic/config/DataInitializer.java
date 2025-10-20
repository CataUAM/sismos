package com.seismic.config;

import com.seismic.entity.*;
import com.seismic.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

//@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final EstacionRepository estacionRepository;
    private final TipoSensorRepository tipoSensorRepository;
    private final SensorRepository sensorRepository;
    private final TipoCanalRepository tipoCanalRepository;
    private final ComponenteRepository componenteRepository;
    private final CanalSensorRepository canalSensorRepository;
    private final LecturaRepository lecturaRepository;
    private final UserEstacionRepository userEstacionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Inicializando datos de prueba...");
        
        if (roleRepository.count() == 0) {
            initializeRoles();
            initializeUsers();
            initializeStations();
            initializeSensorTypes();
            initializeSensors();
            initializeChannelTypes();
            initializeComponents();
            initializeChannels();
            initializeReadings();
            initializeUserStationAssignments();
            
            log.info("Datos de prueba inicializados correctamente");
        } else {
            log.info("Los datos ya existen, omitiendo inicialización");
        }
    }

    private void initializeRoles() {
        List<Role> roles = Arrays.asList(
            Role.builder().name("ADMIN").description("Administrador del sistema").build(),
            Role.builder().name("OPERATOR").description("Operador de estaciones").build(),
            Role.builder().name("VIEWER").description("Visualizador de datos").build(),
            Role.builder().name("STATION_MANAGER").description("Gestor de estaciones").build()
        );
        roleRepository.saveAll(roles);
        log.info("Roles inicializados: {}", roles.size());
    }

    private void initializeUsers() {
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
        Role operatorRole = roleRepository.findByName("OPERATOR").orElseThrow();
        Role viewerRole = roleRepository.findByName("VIEWER").orElseThrow();
        Role managerRole = roleRepository.findByName("STATION_MANAGER").orElseThrow();

        List<User> users = Arrays.asList(
            User.builder()
                .username("admin")
                .email("admin@seismic.com")
                .password(passwordEncoder.encode("password"))
                .firstName("Admin")
                .lastName("Sistema")
                .isActive(true)
                .emailVerified(true)
                .roles(Set.of(adminRole))
                .build(),
            User.builder()
                .username("operator_manizales")
                .email("operator.manizales@seismic.com")
                .password(passwordEncoder.encode("password"))
                .firstName("Operador")
                .lastName("Manizales")
                .isActive(true)
                .emailVerified(true)
                .roles(Set.of(operatorRole))
                .build(),
            User.builder()
                .username("viewer_universidad")
                .email("viewer.universidad@seismic.com")
                .password(passwordEncoder.encode("password"))
                .firstName("Viewer")
                .lastName("Universidad")
                .isActive(true)
                .emailVerified(true)
                .roles(Set.of(viewerRole))
                .build(),
            User.builder()
                .username("manager_centro")
                .email("manager.centro@seismic.com")
                .password(passwordEncoder.encode("password"))
                .firstName("Manager")
                .lastName("Centro")
                .isActive(true)
                .emailVerified(true)
                .roles(Set.of(managerRole))
                .build()
        );
        userRepository.saveAll(users);
        log.info("Usuarios inicializados: {}", users.size());
    }

    private void initializeStations() {
        List<Estacion> estaciones = Arrays.asList(
            Estacion.builder()
                .codigo("MAN001")
                .nombre("Universidad Nacional")
                .latitud(new BigDecimal("5.0703"))
                .longitud(new BigDecimal("-75.5138"))
                .altura(new BigDecimal("2150.0"))
                .geologia("Formación volcánica")
                .red("Red Sísmica Caldas")
                .estado(1)
                .build(),
            Estacion.builder()
                .codigo("MAN002")
                .nombre("Centro Histórico")
                .latitud(new BigDecimal("5.0689"))
                .longitud(new BigDecimal("-75.5174"))
                .altura(new BigDecimal("2153.0"))
                .geologia("Depósitos volcánicos")
                .red("Red Sísmica Caldas")
                .estado(1)
                .build(),
            Estacion.builder()
                .codigo("MAN003")
                .nombre("Zona Norte")
                .latitud(new BigDecimal("5.0803"))
                .longitud(new BigDecimal("-75.5098"))
                .altura(new BigDecimal("2180.0"))
                .geologia("Cenizas volcánicas")
                .red("Red Sísmica Caldas")
                .estado(1)
                .build()
        );
        estacionRepository.saveAll(estaciones);
        log.info("Estaciones inicializadas: {}", estaciones.size());
    }

    private void initializeSensorTypes() {
        List<TipoSensor> tipos = Arrays.asList(
            TipoSensor.builder().nombre("Acelerómetro").unidad("m/s²").build(),
            TipoSensor.builder().nombre("Velocímetro").unidad("m/s").build(),
            TipoSensor.builder().nombre("Desplazómetro").unidad("m").build()
        );
        tipoSensorRepository.saveAll(tipos);
        log.info("Tipos de sensor inicializados: {}", tipos.size());
    }

    private void initializeSensors() {
        List<Estacion> estaciones = estacionRepository.findAll();
        List<TipoSensor> tiposSensor = tipoSensorRepository.findAll();
        
        for (Estacion estacion : estaciones) {
            for (TipoSensor tipo : tiposSensor) {
                Sensor sensor = Sensor.builder()
                    .estacion(estacion)
                    .tipoSensor(tipo)
                    .marca("Kinemetrics")
                    .modelo("FBA-23")
                    .descripcion(tipo.getNombre() + " - " + estacion.getNombre())
                    .frecuenciaMuestreo(new BigDecimal("100.0"))
                    .build();
                sensorRepository.save(sensor);
            }
        }
        log.info("Sensores inicializados para {} estaciones", estaciones.size());
    }

    private void initializeChannelTypes() {
        List<TipoCanal> tipos = Arrays.asList(
            TipoCanal.builder().codigo("ACC").descripcion("Aceleración").build(),
            TipoCanal.builder().codigo("VEL").descripcion("Velocidad").build(),
            TipoCanal.builder().codigo("DIS").descripcion("Desplazamiento").build()
        );
        tipoCanalRepository.saveAll(tipos);
        log.info("Tipos de canal inicializados: {}", tipos.size());
    }

    private void initializeComponents() {
        List<Componente> componentes = Arrays.asList(
            Componente.builder().nombre("Z").descripcion("Vertical").build(),
            Componente.builder().nombre("N").descripcion("Norte-Sur").build(),
            Componente.builder().nombre("E").descripcion("Este-Oeste").build()
        );
        componenteRepository.saveAll(componentes);
        log.info("Componentes inicializados: {}", componentes.size());
    }

    private void initializeChannels() {
        List<Sensor> sensores = sensorRepository.findAll();
        List<TipoCanal> tiposCanal = tipoCanalRepository.findAll();
        List<Componente> componentes = componenteRepository.findAll();

        for (Sensor sensor : sensores) {
            for (Componente componente : componentes) {
                // Crear canal basado en el tipo de sensor
                TipoCanal tipoCanal = tiposCanal.stream()
                    .filter(tc -> tc.getCodigo().equals(getTipoCanal(sensor.getTipoSensor().getNombre())))
                    .findFirst()
                    .orElse(tiposCanal.get(0));

                CanalSensor canal = CanalSensor.builder()
                    .sensor(sensor)
                    .tipoCanal(tipoCanal)
                    .componente(componente)
                    .descripcion(sensor.getDescripcion() + " - " + componente.getDescripcion())
                    .build();
                canalSensorRepository.save(canal);
            }
        }
        log.info("Canales de sensor inicializados");
    }

    private String getTipoCanal(String tipoSensor) {
        switch (tipoSensor) {
            case "Acelerómetro": return "ACC";
            case "Velocímetro": return "VEL";
            case "Desplazómetro": return "DIS";
            default: return "ACC";
        }
    }

    private void initializeReadings() {
        List<CanalSensor> canales = canalSensorRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (CanalSensor canal : canales) {
            // Crear 10 lecturas recientes para cada canal
            for (int i = 0; i < 10; i++) {
                LocalDateTime tiempo = now.minusMinutes(i * 5);
                double valor = Math.random() * 10 + 1; // Valor entre 1 y 11

                Lectura lectura = Lectura.builder()
                    .canal(canal)
                    .tiempo(tiempo)
                    .build();

                // Asignar valor según el tipo de canal
                switch (canal.getTipoCanal().getCodigo()) {
                    case "ACC":
                        lectura.setAceleracion((float) valor);
                        break;
                    case "VEL":
                        lectura.setVelocidad((float) valor);
                        break;
                    case "DIS":
                        lectura.setDesplazamiento((float) valor);
                        break;
                }

                lecturaRepository.save(lectura);
            }
        }
        log.info("Lecturas inicializadas para {} canales", canales.size());
    }

    private void initializeUserStationAssignments() {
        User operatorManizales = userRepository.findByUsername("operator_manizales").orElseThrow();
        User viewerUniversidad = userRepository.findByUsername("viewer_universidad").orElseThrow();
        User managerCentro = userRepository.findByUsername("manager_centro").orElseThrow();

        Estacion universidad = estacionRepository.findByCodigo("MAN001").orElseThrow();
        Estacion centro = estacionRepository.findByCodigo("MAN002").orElseThrow();
        Estacion zonaNorte = estacionRepository.findByCodigo("MAN003").orElseThrow();

        List<UserEstacion> asignaciones = Arrays.asList(
            UserEstacion.builder().user(operatorManizales).estacion(universidad).build(),
            UserEstacion.builder().user(operatorManizales).estacion(centro).build(),
            UserEstacion.builder().user(viewerUniversidad).estacion(universidad).build(),
            UserEstacion.builder().user(managerCentro).estacion(centro).build(),
            UserEstacion.builder().user(managerCentro).estacion(zonaNorte).build()
        );

        userEstacionRepository.saveAll(asignaciones);
        log.info("Asignaciones usuario-estación inicializadas: {}", asignaciones.size());
    }
}
