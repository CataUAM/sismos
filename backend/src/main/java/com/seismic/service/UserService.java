package com.seismic.service;

import com.seismic.dto.EstacionDto;
import com.seismic.dto.UserDto;
import com.seismic.entity.User;
import com.seismic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final EstacionService estacionService;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return convertToDto(user);
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
        return convertToDto(user);
    }

    public UserDto createUser(UserDto userDto) {
        // TODO: Implementar creación de usuario con encriptación de contraseña
        throw new RuntimeException("Creación de usuarios no implementada");
    }

    public UserDto updateUser(Integer id, UserDto userDto) {
        // TODO: Implementar actualización de usuario
        throw new RuntimeException("Actualización de usuarios no implementada");
    }

    public void deleteUser(Integer id) {
        // TODO: Implementar eliminación de usuario
        throw new RuntimeException("Eliminación de usuarios no implementada");
    }

    private UserDto convertToDto(User user) {
        List<EstacionDto> assignedStations = estacionService.getEstacionesByUser(user.getIdUser());
        
        return UserDto.builder()
                .id(user.getIdUser())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toList()))
                .assignedStations(assignedStations)
                .build();
    }
}
