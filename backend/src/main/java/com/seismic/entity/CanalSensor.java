package com.seismic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "canal_sensor")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CanalSensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_canal")
    private Integer idCanal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sensor", nullable = false)
    private Sensor sensor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_canal", nullable = false)
    private TipoCanal tipoCanal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_componente", nullable = false)
    private Componente componente;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "canal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Lectura> lecturas;
}
