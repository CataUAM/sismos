package com.seismic.service;

import com.seismic.dto.SensorDataDto;
import com.seismic.entity.Estacion;
import com.seismic.entity.Lectura;
import com.seismic.entity.Sensor;
import com.seismic.repository.EstacionRepository;
import com.seismic.repository.SensorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SensorService {

    private final SensorRepository sensorRepository;
    private final EstacionRepository estacionRepository;

    public List<SensorDataDto> getSensorsByEstacion(Integer estacionId) {
        Estacion estacion = estacionRepository.findById(estacionId)
                .orElseThrow(() -> new RuntimeException("Estación no encontrada"));

        List<Sensor> sensores = sensorRepository.findByEstacion(estacion);
        
        return sensores.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<SensorDataDto> getSensorsWithRecentReadings(Integer estacionId, int horasAtras) {
        LocalDateTime desde = LocalDateTime.now().minusHours(horasAtras);
        
        List<Sensor> sensores = sensorRepository.findByEstacionIdWithRecentReadings(estacionId, desde);
        
        return sensores.stream()
                .map(sensor -> convertToDtoWithReadings(sensor, desde))
                .collect(Collectors.toList());
    }

    private SensorDataDto convertToDto(Sensor sensor) {
        String nombreSensor = generateSensorName(sensor);
        
        return SensorDataDto.builder()
                .idSensor(sensor.getIdSensor())
                .nombre(nombreSensor)
                .marca(sensor.getMarca())
                .modelo(sensor.getModelo())
                .tipoSensor(sensor.getTipoSensor().getNombre())
                .descripcion(sensor.getDescripcion())
                .build();
    }

    private SensorDataDto convertToDtoWithReadings(Sensor sensor, LocalDateTime desde) {
        String nombreSensor = generateSensorName(sensor);
        
        List<SensorDataDto.LecturaDto> lecturas = sensor.getCanales().stream()
                .flatMap(canal -> canal.getLecturas().stream()
                        .filter(lectura -> lectura.getTiempo().isAfter(desde))
                        .map(lectura -> SensorDataDto.LecturaDto.builder()
                                .tiempo(lectura.getTiempo())
                                .aceleracion(lectura.getAceleracion())
                                .velocidad(lectura.getVelocidad())
                                .desplazamiento(lectura.getDesplazamiento())
                                .canal(canal.getTipoCanal().getCodigo())
                                .componente(canal.getComponente().getNombre())
                                .build()))
                .collect(Collectors.toList());

        return SensorDataDto.builder()
                .idSensor(sensor.getIdSensor())
                .nombre(nombreSensor)
                .marca(sensor.getMarca())
                .modelo(sensor.getModelo())
                .tipoSensor(sensor.getTipoSensor().getNombre())
                .descripcion(sensor.getDescripcion())
                .lecturas(lecturas)
                .build();
    }

    private String generateSensorName(Sensor sensor) {
        StringBuilder nombre = new StringBuilder();
        
        // Usar tipo de sensor como base
        nombre.append(sensor.getTipoSensor().getNombre());
        
        // Agregar marca si está disponible
        if (sensor.getMarca() != null && !sensor.getMarca().isEmpty()) {
            nombre.append(" ").append(sensor.getMarca());
        }
        
        // Agregar modelo si está disponible
        if (sensor.getModelo() != null && !sensor.getModelo().isEmpty()) {
            nombre.append(" ").append(sensor.getModelo());
        }
        
        // Si no hay información suficiente, usar ID
        if (nombre.toString().equals(sensor.getTipoSensor().getNombre())) {
            nombre.append(" #").append(sensor.getIdSensor());
        }
        
        return nombre.toString();
    }
}
