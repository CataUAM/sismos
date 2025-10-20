package com.seismic.controller;

import com.seismic.dto.LecturaDto;
import com.seismic.service.LecturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/lecturas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class LecturaController {

    private final LecturaService lecturaService;

    @GetMapping("/recientes")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<LecturaDto>> getLecturasRecientes(
            @RequestParam(defaultValue = "24") int horas) {
        List<LecturaDto> lecturas = lecturaService.getLecturasRecientes(horas);
        return ResponseEntity.ok(lecturas);
    }

    @GetMapping("/estacion/{idEstacion}")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<LecturaDto>> getLecturasByEstacion(
            @PathVariable Integer idEstacion,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        List<LecturaDto> lecturas = lecturaService.getLecturasByEstacion(idEstacion, desde, hasta);
        return ResponseEntity.ok(lecturas);
    }

    @GetMapping("/sensor/{idSensor}")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<LecturaDto>> getLecturasBySensor(
            @PathVariable Integer idSensor,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        List<LecturaDto> lecturas = lecturaService.getLecturasBySensor(idSensor, desde, hasta);
        return ResponseEntity.ok(lecturas);
    }

    @GetMapping("/canal/{idCanal}")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<LecturaDto>> getLecturasByCanal(
            @PathVariable Integer idCanal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {
        List<LecturaDto> lecturas = lecturaService.getLecturasByCanal(idCanal, desde, hasta);
        return ResponseEntity.ok(lecturas);
    }

    @GetMapping("/tiempo-real")
    @PreAuthorize("hasRole('VIEWER') or hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<LecturaDto>> getLecturasTiempoReal() {
        List<LecturaDto> lecturas = lecturaService.getLecturasUltimaHora();
        return ResponseEntity.ok(lecturas);
    }

    @PostMapping
    @PreAuthorize("hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<LecturaDto> createLectura(@RequestBody LecturaDto lecturaDto) {
        LecturaDto nuevaLectura = lecturaService.createLectura(lecturaDto);
        return ResponseEntity.ok(nuevaLectura);
    }

    @PostMapping("/batch")
    @PreAuthorize("hasRole('OPERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<LecturaDto>> createLecturasBatch(@RequestBody List<LecturaDto> lecturasDto) {
        List<LecturaDto> nuevasLecturas = lecturaService.createLecturasBatch(lecturasDto);
        return ResponseEntity.ok(nuevasLecturas);
    }
}
