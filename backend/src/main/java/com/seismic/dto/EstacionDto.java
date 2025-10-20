package com.seismic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstacionDto {
    
    private Integer idEstacion;
    private String codigo;
    private String nombre;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private BigDecimal altura;
    private String geologia;
    private String red;
    private Integer estado;
    private List<SensorDto> sensores;
    private Integer totalSensores;
    private String ultimaLectura;
}
