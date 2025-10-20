package com.seismic.controller;

import com.seismic.dto.EstacionDto;
import com.seismic.dto.UserDto;
import com.seismic.dto.UserStationAssignmentDto;
import com.seismic.service.EstacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class EstacionController {

    private final EstacionService estacionService;

    @GetMapping("/public/mapa")
    public ResponseEntity<List<EstacionDto>> getEstacionesParaMapa() {
        List<EstacionDto> estaciones = estacionService.getEstacionesActivasConCoordenadas();
        return ResponseEntity.ok(estaciones);
    }

    @GetMapping
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<EstacionDto>> getAllEstaciones() {
        List<EstacionDto> estaciones = estacionService.getAllEstaciones();
        return ResponseEntity.ok(estaciones);
    }

    @GetMapping("/activas")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<EstacionDto>> getEstacionesActivas() {
        List<EstacionDto> estaciones = estacionService.getEstacionesActivas();
        return ResponseEntity.ok(estaciones);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<EstacionDto> getEstacionById(@PathVariable Integer id) {
        EstacionDto estacion = estacionService.getEstacionById(id);
        return ResponseEntity.ok(estacion);
    }

    @GetMapping("/codigo/{codigo}")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<EstacionDto> getEstacionByCodigo(@PathVariable String codigo) {
        EstacionDto estacion = estacionService.getEstacionByCodigo(codigo);
        return ResponseEntity.ok(estacion);
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<EstacionDto>> buscarEstaciones(@RequestParam String termino) {
        List<EstacionDto> estaciones = estacionService.buscarEstaciones(termino);
        return ResponseEntity.ok(estaciones);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstacionDto> createEstacion(@RequestBody EstacionDto estacionDto) {
        EstacionDto nuevaEstacion = estacionService.createEstacion(estacionDto);
        return ResponseEntity.ok(nuevaEstacion);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstacionDto> updateEstacion(@PathVariable Integer id, @RequestBody EstacionDto estacionDto) {
        EstacionDto estacionActualizada = estacionService.updateEstacion(id, estacionDto);
        return ResponseEntity.ok(estacionActualizada);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEstacion(@PathVariable Integer id) {
        estacionService.deleteEstacion(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoints para manejo de asociaciones usuario-estación
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    public ResponseEntity<List<EstacionDto>> getEstacionesByUser(@PathVariable Integer userId) {
        List<EstacionDto> estaciones = estacionService.getEstacionesByUser(userId);
        return ResponseEntity.ok(estaciones);
    }

    @GetMapping("/my-stations")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    public ResponseEntity<List<EstacionDto>> getMyStations(Authentication authentication) {
        String username = authentication.getName();
        List<EstacionDto> estaciones = estacionService.getEstacionesByUsername(username);
        return ResponseEntity.ok(estaciones);
    }

    @PostMapping("/{estacionId}/assign-user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    public ResponseEntity<UserStationAssignmentDto> assignUserToStation(
            @PathVariable Integer estacionId, 
            @PathVariable Integer userId,
            Authentication authentication) {
        String assignedByUsername = authentication.getName();
        UserStationAssignmentDto assignment = estacionService.assignUserToStation(estacionId, userId, assignedByUsername);
        return ResponseEntity.ok(assignment);
    }

    @DeleteMapping("/{estacionId}/unassign-user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    public ResponseEntity<Void> unassignUserFromStation(
            @PathVariable Integer estacionId, 
            @PathVariable Integer userId) {
        estacionService.unassignUserFromStation(estacionId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{estacionId}/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    public ResponseEntity<List<UserDto>> getUsersByStation(@PathVariable Integer estacionId) {
        List<UserDto> users = estacionService.getUsersByStation(estacionId);
        return ResponseEntity.ok(users);
    }
}
