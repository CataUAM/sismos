package com.seismic.repository;

import com.seismic.entity.Estacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstacionRepository extends JpaRepository<Estacion, Integer> {
    
    Optional<Estacion> findByCodigo(String codigo);
    
    List<Estacion> findByEstado(Integer estado);
    
    @Query("SELECT e FROM Estacion e WHERE e.estado = 1")
    List<Estacion> findAllActive();
    
    @Query("SELECT e FROM Estacion e WHERE e.latitud IS NOT NULL AND e.longitud IS NOT NULL AND e.estado = 1")
    List<Estacion> findAllActiveWithCoordinates();
    
    @Query("SELECT e FROM Estacion e JOIN FETCH e.sensores s WHERE e.estado = 1")
    List<Estacion> findAllActiveWithSensors();
    
    @Query("SELECT e FROM Estacion e WHERE LOWER(e.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) OR LOWER(e.codigo) LIKE LOWER(CONCAT('%', :codigo, '%'))")
    List<Estacion> findByNombreOrCodigoContainingIgnoreCase(@Param("nombre") String nombre, @Param("codigo") String codigo);
}
