package com.seismic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tipo_sensor")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoSensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_sensor")
    private Integer idTipoSensor;

    @Column(unique = true, nullable = false, length = 50)
    private String nombre;

    @Column(length = 50)
    private String unidad;

    @OneToMany(mappedBy = "tipoSensor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Sensor> sensores;
}
