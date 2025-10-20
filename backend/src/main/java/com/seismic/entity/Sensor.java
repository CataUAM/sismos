package com.seismic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "sensor")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sensor")
    private Integer idSensor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estacion", nullable = false)
    private Estacion estacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_sensor", nullable = false)
    private TipoSensor tipoSensor;

    @Column(length = 100)
    private String marca;

    @Column(length = 100)
    private String modelo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "frecuencia_muestreo", precision = 6, scale = 2, nullable = false)
    private BigDecimal frecuenciaMuestreo;

    @OneToMany(mappedBy = "sensor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CanalSensor> canales;

    @OneToMany(mappedBy = "sensor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Grafica> graficas;
}
