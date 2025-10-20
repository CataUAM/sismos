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
public class SensorDto {
    
    private Integer idSensor;
    private Integer idEstacion;
    private String estacionNombre;
    private String estacionCodigo;
    private String tipoSensor;
    private String marca;
    private String modelo;
    private String descripcion;
    private BigDecimal frecuenciaMuestreo;
    private List<CanalSensorDto> canales;
    private String ultimaLectura;
}
