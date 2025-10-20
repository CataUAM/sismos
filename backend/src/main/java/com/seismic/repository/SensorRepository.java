package com.seismic.repository;

import com.seismic.entity.Estacion;
import com.seismic.entity.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Integer> {
    
    List<Sensor> findByEstacion(Estacion estacion);
    
    @Query("SELECT s FROM Sensor s JOIN FETCH s.estacion e WHERE e.estado = 1")
    List<Sensor> findAllFromActiveStations();
    
    @Query("SELECT s FROM Sensor s JOIN FETCH s.canales c WHERE s.idSensor = :sensorId")
    List<Sensor> findByIdWithChannels(@Param("sensorId") Integer sensorId);
    
    @Query("SELECT s FROM Sensor s JOIN s.tipoSensor ts WHERE ts.nombre = :tipoSensor")
    List<Sensor> findByTipoSensorNombre(@Param("tipoSensor") String tipoSensor);
    
    @Query("SELECT DISTINCT s FROM Sensor s " +
           "LEFT JOIN FETCH s.canales c " +
           "LEFT JOIN FETCH c.lecturas l " +
           "LEFT JOIN FETCH s.tipoSensor " +
           "WHERE s.estacion.id = :estacionId " +
           "AND (l.tiempo >= :desde OR l.tiempo IS NULL)")
    List<Sensor> findByEstacionIdWithRecentReadings(@Param("estacionId") Integer estacionId, 
                                                   @Param("desde") LocalDateTime desde);
    
    @Query("SELECT s FROM Sensor s " +
           "LEFT JOIN FETCH s.tipoSensor " +
           "WHERE s.estacion.id = :estacionId")
    List<Sensor> findByEstacionIdWithTipoSensor(@Param("estacionId") Integer estacionId);
}
