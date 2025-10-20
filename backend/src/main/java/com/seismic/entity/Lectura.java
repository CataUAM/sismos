package com.seismic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lectura", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"id_canal", "tiempo"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lectura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lectura")
    private Long idLectura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_canal", nullable = false)
    private CanalSensor canal;

    @Column(nullable = false)
    private LocalDateTime tiempo;

    private Float aceleracion;

    private Float velocidad;

    private Float desplazamiento;
}
