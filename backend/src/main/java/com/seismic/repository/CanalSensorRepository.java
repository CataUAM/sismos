package com.seismic.repository;

import com.seismic.entity.CanalSensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CanalSensorRepository extends JpaRepository<CanalSensor, Integer> {
    
    List<CanalSensor> findBySensorIdSensor(Integer idSensor);
    
    @Query("SELECT c FROM CanalSensor c JOIN FETCH c.sensor s JOIN FETCH s.estacion e WHERE e.estado = 1")
    List<CanalSensor> findAllFromActiveStations();
    
    @Query("SELECT c FROM CanalSensor c WHERE c.tipoCanal.codigo = :codigoCanal")
    List<CanalSensor> findByTipoCanalCodigo(@Param("codigoCanal") String codigoCanal);
    
    @Query("SELECT c FROM CanalSensor c WHERE c.componente.nombre = :componente")
    List<CanalSensor> findByComponenteNombre(@Param("componente") String componente);
}
