package com.seismic.service;

import com.seismic.dto.LecturaDto;
import com.seismic.entity.CanalSensor;
import com.seismic.entity.Lectura;
import com.seismic.repository.CanalSensorRepository;
import com.seismic.repository.LecturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LecturaService {

    private final LecturaRepository lecturaRepository;
    private final CanalSensorRepository canalSensorRepository;

    public List<LecturaDto> getLecturasRecientes(int horas) {
        LocalDateTime desde = LocalDateTime.now().minusHours(horas);
        return lecturaRepository.findRecentReadings(desde).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<LecturaDto> getLecturasByEstacion(Integer idEstacion, LocalDateTime desde, LocalDateTime hasta) {
        final LocalDateTime finalDesde = desde == null ? LocalDateTime.now().minusDays(1) : desde;
        final LocalDateTime finalHasta = hasta == null ? LocalDateTime.now() : hasta;
        
        return lecturaRepository.findRecentByEstacion(idEstacion, finalDesde).stream()
                .filter(lectura -> lectura.getTiempo().isBefore(finalHasta) || lectura.getTiempo().isEqual(finalHasta))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<LecturaDto> getLecturasBySensor(Integer idSensor, LocalDateTime desde, LocalDateTime hasta) {
        final LocalDateTime finalDesde = desde == null ? LocalDateTime.now().minusDays(1) : desde;
        final LocalDateTime finalHasta = hasta == null ? LocalDateTime.now() : hasta;
        
        return lecturaRepository.findRecentBySensor(idSensor, finalDesde).stream()
                .filter(lectura -> lectura.getTiempo().isBefore(finalHasta) || lectura.getTiempo().isEqual(finalHasta))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<LecturaDto> getLecturasByCanal(Integer idCanal, LocalDateTime desde, LocalDateTime hasta) {
        if (desde == null) desde = LocalDateTime.now().minusDays(1);
        if (hasta == null) hasta = LocalDateTime.now();
        
        return lecturaRepository.findByCanalAndTiempoRange(idCanal, desde, hasta).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<LecturaDto> getLecturasUltimaHora() {
        LocalDateTime desde = LocalDateTime.now().minusHours(1);
        return lecturaRepository.findRecentReadings(desde).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public LecturaDto createLectura(LecturaDto lecturaDto) {
        Lectura lectura = convertToEntity(lecturaDto);
        Lectura savedLectura = lecturaRepository.save(lectura);
        return convertToDto(savedLectura);
    }

    public List<LecturaDto> createLecturasBatch(List<LecturaDto> lecturasDto) {
        List<Lectura> lecturas = lecturasDto.stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
        
        List<Lectura> savedLecturas = lecturaRepository.saveAll(lecturas);
        return savedLecturas.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private LecturaDto convertToDto(Lectura lectura) {
        return LecturaDto.builder()
                .idLectura(lectura.getIdLectura())
                .idCanal(lectura.getCanal().getIdCanal())
                .estacionCodigo(lectura.getCanal().getSensor().getEstacion().getCodigo())
                .sensorTipo(lectura.getCanal().getSensor().getTipoSensor().getNombre())
                .canalTipo(lectura.getCanal().getTipoCanal().getCodigo())
                .componente(lectura.getCanal().getComponente().getNombre())
                .tiempo(lectura.getTiempo())
                .aceleracion(lectura.getAceleracion())
                .velocidad(lectura.getVelocidad())
                .desplazamiento(lectura.getDesplazamiento())
                .build();
    }

    private Lectura convertToEntity(LecturaDto dto) {
        CanalSensor canal = canalSensorRepository.findById(dto.getIdCanal())
                .orElseThrow(() -> new RuntimeException("Canal no encontrado con ID: " + dto.getIdCanal()));

        return Lectura.builder()
                .canal(canal)
                .tiempo(dto.getTiempo())
                .aceleracion(dto.getAceleracion())
                .velocidad(dto.getVelocidad())
                .desplazamiento(dto.getDesplazamiento())
                .build();
    }
}
