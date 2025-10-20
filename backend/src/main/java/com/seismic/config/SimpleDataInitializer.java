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
import java.util.Set;

//@Component
@RequiredArgsConstructor
@Slf4j
public class SimpleDataInitializer implements CommandLineRunner {

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
        if (roleRepository.count() == 0) {
            log.info("Initializing basic test data...");
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
            log.info("Basic test data initialization completed");
        }
    }

    private void initializeRoles() {
        Role adminRole = Role.builder().name("ADMIN").build();
        Role operatorRole = Role.builder().name("OPERATOR").build();
        Role viewerRole = Role.builder().name("VIEWER").build();
        Role stationManagerRole = Role.builder().name("STATION_MANAGER").build();
        
        roleRepository.saveAll(Arrays.asList(adminRole, operatorRole, viewerRole, stationManagerRole));
        log.info("Roles initialized");
    }

    private void initializeUsers() {
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
        Role operatorRole = roleRepository.findByName("OPERATOR").orElseThrow();
        Role viewerRole = roleRepository.findByName("VIEWER").orElseThrow();

        User admin = User.builder()
            .username("admin")
            .password(passwordEncoder.encode("password"))
            .email("admin@seismic.com")
            .firstName("Administrador")
            .lastName("Sistema")
            .roles(Set.of(adminRole))
            .build();

        User operator = User.builder()
            .username("operator_manizales")
            .password(passwordEncoder.encode("password"))
            .email("operator.manizales@seismic.com")
            .firstName("Juan Carlos")
            .lastName("Rodríguez")
            .roles(Set.of(operatorRole))
            .build();

        User viewer = User.builder()
            .username("viewer_universidad")
            .password(passwordEncoder.encode("password"))
            .email("viewer.universidad@seismic.com")
            .firstName("Dr. Carlos")
            .lastName("Pérez")
            .roles(Set.of(viewerRole))
            .build();

        userRepository.saveAll(Arrays.asList(admin, operator, viewer));
        log.info("Users initialized");
    }

    private void initializeStations() {
        Estacion man001 = Estacion.builder()
            .codigo("MAN001")
            .nombre("Universidad Nacional")
            .latitud(new BigDecimal("5.0703"))
            .longitud(new BigDecimal("-75.5138"))
            .altura(new BigDecimal("2150"))
            .geologia("Roca volcánica")
            .red("Red Sísmica Nacional")
            .estado(1)
            .build();

        Estacion man002 = Estacion.builder()
            .codigo("MAN002")
            .nombre("Centro Histórico")
            .latitud(new BigDecimal("5.0689"))
            .longitud(new BigDecimal("-75.5174"))
            .altura(new BigDecimal("2153"))
            .geologia("Depósitos aluviales")
            .red("Red Sísmica Nacional")
            .estado(1)
            .build();

        estacionRepository.saveAll(Arrays.asList(man001, man002));
        log.info("Stations initialized");
    }

    private void initializeSensorTypes() {
        TipoSensor acelerometro = TipoSensor.builder()
            .nombre("Acelerómetro")
            .unidad("m/s²")
            .build();

        TipoSensor velocimetro = TipoSensor.builder()
            .nombre("Velocímetro")
            .unidad("m/s")
            .build();

        tipoSensorRepository.saveAll(Arrays.asList(acelerometro, velocimetro));
        log.info("Sensor types initialized");
    }

    private void initializeSensors() {
        Estacion man001 = estacionRepository.findByCodigo("MAN001").orElseThrow();
        Estacion man002 = estacionRepository.findByCodigo("MAN002").orElseThrow();
        TipoSensor acelerometro = tipoSensorRepository.findByNombre("Acelerómetro").orElseThrow();

        Sensor sensor1 = Sensor.builder()
            .estacion(man001)
            .tipoSensor(acelerometro)
            .marca("Kinemetrics")
            .modelo("FBA-23")
            .descripcion("Acelerómetro - Universidad Nacional")
            .frecuenciaMuestreo(new BigDecimal("100.0"))
            .build();

        Sensor sensor2 = Sensor.builder()
            .estacion(man002)
            .tipoSensor(acelerometro)
            .marca("Kinemetrics")
            .modelo("FBA-23")
            .descripcion("Acelerómetro - Centro Histórico")
            .frecuenciaMuestreo(new BigDecimal("100.0"))
            .build();

        sensorRepository.saveAll(Arrays.asList(sensor1, sensor2));
        log.info("Sensors initialized");
    }

    private void initializeChannelTypes() {
        TipoCanal acc = TipoCanal.builder().codigo("ACC").descripcion("Aceleración").build();
        TipoCanal vel = TipoCanal.builder().codigo("VEL").descripcion("Velocidad").build();
        
        tipoCanalRepository.saveAll(Arrays.asList(acc, vel));
        log.info("Channel types initialized");
    }

    private void initializeComponents() {
        Componente z = Componente.builder().nombre("Z").descripcion("Vertical").build();
        Componente n = Componente.builder().nombre("N").descripcion("Norte-Sur").build();
        Componente e = Componente.builder().nombre("E").descripcion("Este-Oeste").build();
        
        componenteRepository.saveAll(Arrays.asList(z, n, e));
        log.info("Components initialized");
    }

    private void initializeChannels() {
        Sensor sensor1 = sensorRepository.findAll().get(0);
        TipoCanal acc = tipoCanalRepository.findByCodigo("ACC").orElseThrow();
        Componente z = componenteRepository.findByNombre("Z").orElseThrow();

        CanalSensor canal = CanalSensor.builder()
            .sensor(sensor1)
            .tipoCanal(acc)
            .componente(z)
            .descripcion("Canal Z - Aceleración")
            .build();

        canalSensorRepository.save(canal);
        log.info("Channels initialized");
    }

    private void initializeReadings() {
        CanalSensor canal = canalSensorRepository.findAll().get(0);
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < 5; i++) {
            Lectura lectura = Lectura.builder()
                .canal(canal)
                .tiempo(now.minusMinutes(i * 5))
                .aceleracion((float) (Math.random() * 10 + 1))
                .build();
            lecturaRepository.save(lectura);
        }
        log.info("Sample readings initialized");
    }

    private void initializeUserStationAssignments() {
        User operator = userRepository.findByUsername("operator_manizales").orElseThrow();
        User viewer = userRepository.findByUsername("viewer_universidad").orElseThrow();
        Estacion man001 = estacionRepository.findByCodigo("MAN001").orElseThrow();
        Estacion man002 = estacionRepository.findByCodigo("MAN002").orElseThrow();

        UserEstacion assignment1 = UserEstacion.builder()
            .user(operator)
            .estacion(man001)
            .build();

        UserEstacion assignment2 = UserEstacion.builder()
            .user(viewer)
            .estacion(man001)
            .build();

        userEstacionRepository.saveAll(Arrays.asList(assignment1, assignment2));
        log.info("User-station assignments initialized");
    }
}
