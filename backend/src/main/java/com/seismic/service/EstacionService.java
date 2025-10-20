package com.seismic.service;

import com.seismic.dto.EstacionDto;
import com.seismic.dto.UserDto;
import com.seismic.dto.UserStationAssignmentDto;
import com.seismic.entity.Estacion;
import com.seismic.entity.User;
import com.seismic.entity.UserEstacion;
import com.seismic.repository.EstacionRepository;
import com.seismic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EstacionService {

    private final EstacionRepository estacionRepository;
    private final UserRepository userRepository;

    public List<EstacionDto> getAllEstaciones() {
        return estacionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EstacionDto> getEstacionesActivas() {
        return estacionRepository.findAllActive().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EstacionDto> getEstacionesActivasConCoordenadas() {
        return estacionRepository.findAllActiveWithCoordinates().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EstacionDto getEstacionById(Integer id) {
        Estacion estacion = estacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada con ID: " + id));
        return convertToDto(estacion);
    }

    public EstacionDto getEstacionByCodigo(String codigo) {
        Estacion estacion = estacionRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada con código: " + codigo));
        return convertToDto(estacion);
    }

    public List<EstacionDto> buscarEstaciones(String termino) {
        return estacionRepository.findByNombreOrCodigoContainingIgnoreCase(termino, termino).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EstacionDto createEstacion(EstacionDto estacionDto) {
        Estacion estacion = convertToEntity(estacionDto);
        Estacion savedEstacion = estacionRepository.save(estacion);
        return convertToDto(savedEstacion);
    }

    public EstacionDto updateEstacion(Integer id, EstacionDto estacionDto) {
        Estacion estacion = estacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada con ID: " + id));
        
        updateEntityFromDto(estacion, estacionDto);
        Estacion updatedEstacion = estacionRepository.save(estacion);
        return convertToDto(updatedEstacion);
    }

    public void deleteEstacion(Integer id) {
        if (!estacionRepository.existsById(id)) {
            throw new RuntimeException("Estación no encontrada con ID: " + id);
        }
        estacionRepository.deleteById(id);
    }

    private EstacionDto convertToDto(Estacion estacion) {
        return EstacionDto.builder()
                .idEstacion(estacion.getIdEstacion())
                .codigo(estacion.getCodigo())
                .nombre(estacion.getNombre())
                .latitud(estacion.getLatitud())
                .longitud(estacion.getLongitud())
                .altura(estacion.getAltura())
                .geologia(estacion.getGeologia())
                .red(estacion.getRed())
                .estado(estacion.getEstado())
                .totalSensores(estacion.getSensores() != null ? estacion.getSensores().size() : 0)
                .build();
    }

    private Estacion convertToEntity(EstacionDto dto) {
        return Estacion.builder()
                .codigo(dto.getCodigo())
                .nombre(dto.getNombre())
                .latitud(dto.getLatitud())
                .longitud(dto.getLongitud())
                .altura(dto.getAltura())
                .geologia(dto.getGeologia())
                .red(dto.getRed())
                .estado(dto.getEstado() != null ? dto.getEstado() : 1)
                .build();
    }

    private void updateEntityFromDto(Estacion estacion, EstacionDto dto) {
        estacion.setCodigo(dto.getCodigo());
        estacion.setNombre(dto.getNombre());
        estacion.setLatitud(dto.getLatitud());
        estacion.setLongitud(dto.getLongitud());
        estacion.setAltura(dto.getAltura());
        estacion.setGeologia(dto.getGeologia());
        estacion.setRed(dto.getRed());
        estacion.setEstado(dto.getEstado());
    }

    // Métodos para manejo de asociaciones usuario-estación
    public List<EstacionDto> getEstacionesByUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        
        // Si es admin, devolver todas las estaciones
        if (user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()))) {
            return getAllEstaciones();
        }
        
        // Para otros usuarios, devolver solo estaciones asignadas
        // TODO: Implementar consulta con UserEstacion cuando se cree el repositorio
        return getEstacionesActivas(); // Placeholder temporal
    }

    public List<EstacionDto> getEstacionesByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
        return getEstacionesByUser(user.getIdUser());
    }

    public UserStationAssignmentDto assignUserToStation(Integer estacionId, Integer userId, String assignedByUsername) {
        Estacion estacion = estacionRepository.findById(estacionId)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada con ID: " + estacionId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        
        User assignedBy = userRepository.findByUsername(assignedByUsername)
                .orElseThrow(() -> new RuntimeException("Usuario asignador no encontrado: " + assignedByUsername));

        // TODO: Crear y guardar UserEstacion cuando se implemente el repositorio
        
        return UserStationAssignmentDto.builder()
                .userId(userId)
                .username(user.getUsername())
                .userFullName(user.getFullName())
                .estacionId(estacionId)
                .estacionCodigo(estacion.getCodigo())
                .estacionNombre(estacion.getNombre())
                .assignedBy(assignedBy.getIdUser())
                .assignedAt(LocalDateTime.now())
                .build();
    }

    public void unassignUserFromStation(Integer estacionId, Integer userId) {
        // TODO: Implementar eliminación de UserEstacion cuando se cree el repositorio
    }

    public List<UserDto> getUsersByStation(Integer estacionId) {
        Estacion estacion = estacionRepository.findById(estacionId)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada con ID: " + estacionId));
        
        // TODO: Implementar consulta de usuarios asignados a la estación
        return List.of(); // Placeholder temporal
    }

    private UserDto convertUserToDto(User user) {
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
                .build();
    }
}
