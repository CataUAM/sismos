package com.seismic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tipo_canal")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoCanal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_canal")
    private Integer idTipoCanal;

    @Column(unique = true, nullable = false, length = 3)
    private String codigo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "tipoCanal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CanalSensor> canalesSensor;
}
