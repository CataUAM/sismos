package com.seismic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "componente")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Componente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_componente")
    private Integer idComponente;

    @Column(unique = true, nullable = false, length = 1)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "componente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CanalSensor> canalesSensor;
}
