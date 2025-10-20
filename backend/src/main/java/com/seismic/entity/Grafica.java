package com.seismic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "grafica")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Grafica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grafica")
    private Integer idGrafica;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sensor", nullable = false)
    private Sensor sensor;

    @Column(length = 20)
    private String tipo; // 'aceleracion', 'velocidad', 'desplazamiento', 'combinada'

    @Column(name = "tiempo_inicio")
    private LocalDateTime tiempoInicio;

    @Column(name = "tiempo_fin")
    private LocalDateTime tiempoFin;

    @Lob
    private byte[] imagen;
}
