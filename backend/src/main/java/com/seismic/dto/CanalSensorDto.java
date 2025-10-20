package com.seismic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CanalSensorDto {
    
    private Integer idCanal;
    private Integer idSensor;
    private String tipoCanal;
    private String componente;
    private String descripcion;
    private String ultimaLectura;
}
