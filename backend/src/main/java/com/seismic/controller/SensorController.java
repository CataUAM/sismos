package com.seismic.controller;

import com.seismic.dto.SensorDataDto;
import com.seismic.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SensorController {

    private final SensorService sensorService;

    @GetMapping("/estacion/{estacionId}")
    @PreAuthorize("hasRole('ADMIN') or @estacionService.hasAccessToEstacion(authentication.name, #estacionId)")
    public ResponseEntity<List<SensorDataDto>> getSensorsByEstacion(@PathVariable Integer estacionId) {
        List<SensorDataDto> sensores = sensorService.getSensorsByEstacion(estacionId);
        return ResponseEntity.ok(sensores);
    }

    @GetMapping("/estacion/{estacionId}/lecturas-recientes")
    public ResponseEntity<List<SensorDataDto>> getSensorsWithRecentReadings(
            @PathVariable Integer estacionId,
            @RequestParam(defaultValue = "24") int horas) {
        List<SensorDataDto> sensores = sensorService.getSensorsWithRecentReadings(estacionId, horas);
        return ResponseEntity.ok(sensores);
    }
}
