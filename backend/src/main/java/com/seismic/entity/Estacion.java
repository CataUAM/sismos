package com.seismic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "estacion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Estacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estacion")
    private Integer idEstacion;

    @Column(unique = true, nullable = false, length = 10)
    private String codigo;

    @Column(length = 100)
    private String nombre;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitud;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitud;

    @Column(precision = 10, scale = 2)
    private BigDecimal altura;

    @Column(length = 100)
    private String geologia;

    @Column(length = 10)
    private String red;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer estado = 1;

    @OneToMany(mappedBy = "estacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Sensor> sensores;

    public boolean isActiva() {
        return estado != null && estado == 1;
    }
}
