package com.seismic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LecturaDto {
    
    private Long idLectura;
    private Integer idCanal;
    private String estacionCodigo;
    private String sensorTipo;
    private String canalTipo;
    private String componente;
    private LocalDateTime tiempo;
    private Float aceleracion;
    private Float velocidad;
    private Float desplazamiento;
}
