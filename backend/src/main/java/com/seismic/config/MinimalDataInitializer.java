package com.seismic.config;

import com.seismic.entity.Role;
import com.seismic.entity.User;
import com.seismic.repository.RoleRepository;
import com.seismic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;

//@Component
@RequiredArgsConstructor
@Slf4j
public class MinimalDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            log.info("Initializing minimal test data for authentication...");
            initializeRoles();
            initializeUsers();
            log.info("Minimal test data initialization completed");
        }
    }

    private void initializeRoles() {
        Role adminRole = Role.builder().name("ADMIN").build();
        Role operatorRole = Role.builder().name("OPERATOR").build();
        Role viewerRole = Role.builder().name("VIEWER").build();
        Role stationManagerRole = Role.builder().name("STATION_MANAGER").build();
        
        roleRepository.saveAll(Arrays.asList(adminRole, operatorRole, viewerRole, stationManagerRole));
        log.info("Roles initialized: ADMIN, OPERATOR, VIEWER, STATION_MANAGER");
    }

    private void initializeUsers() {
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
        Role operatorRole = roleRepository.findByName("OPERATOR").orElseThrow();
        Role viewerRole = roleRepository.findByName("VIEWER").orElseThrow();

        // Create admin user
        User admin = User.builder()
            .username("admin")
            .password(passwordEncoder.encode("password"))
            .email("admin@seismic.com")
            .firstName("Administrador")
            .lastName("Sistema")
            .roles(Set.of(adminRole))
            .build();

        // Create operator user
        User operator = User.builder()
            .username("operator_manizales")
            .password(passwordEncoder.encode("password"))
            .email("operator.manizales@seismic.com")
            .firstName("Juan Carlos")
            .lastName("Rodríguez")
            .roles(Set.of(operatorRole))
            .build();

        // Create viewer user
        User viewer = User.builder()
            .username("viewer_universidad")
            .password(passwordEncoder.encode("password"))
            .email("viewer.universidad@seismic.com")
            .firstName("Dr. Carlos")
            .lastName("Pérez")
            .roles(Set.of(viewerRole))
            .build();

        userRepository.saveAll(Arrays.asList(admin, operator, viewer));
        log.info("Users initialized: admin/password, operator_manizales/password, viewer_universidad/password");
    }
}
