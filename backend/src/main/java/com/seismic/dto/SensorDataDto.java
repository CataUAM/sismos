package com.seismic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SensorDataDto {
    private Integer idSensor;
    private String nombre;
    private String marca;
    private String modelo;
    private String tipoSensor;
    private String descripcion;
    private List<LecturaDto> lecturas;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LecturaDto {
        private LocalDateTime tiempo;
        private Float aceleracion;
        private Float velocidad;
        private Float desplazamiento;
        private String canal;
        private String componente;
    }
}
