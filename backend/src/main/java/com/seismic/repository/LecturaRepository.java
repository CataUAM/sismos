package com.seismic.repository;

import com.seismic.entity.Lectura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LecturaRepository extends JpaRepository<Lectura, Long> {
    
    List<Lectura> findByCanalIdCanal(Integer idCanal);
    
    @Query("SELECT l FROM Lectura l WHERE l.canal.idCanal = :idCanal AND l.tiempo BETWEEN :inicio AND :fin ORDER BY l.tiempo")
    List<Lectura> findByCanalAndTiempoRange(@Param("idCanal") Integer idCanal, 
                                           @Param("inicio") LocalDateTime inicio, 
                                           @Param("fin") LocalDateTime fin);
    
    @Query("SELECT l FROM Lectura l WHERE l.canal.sensor.idSensor = :sensorId AND l.tiempo >= :desde ORDER BY l.tiempo DESC")
    List<Lectura> findRecentBySensor(@Param("sensorId") Integer sensorId, @Param("desde") LocalDateTime desde);
    
    @Query("SELECT l FROM Lectura l WHERE l.canal.sensor.estacion.idEstacion = :estacionId AND l.tiempo >= :desde ORDER BY l.tiempo DESC")
    List<Lectura> findRecentByEstacion(@Param("estacionId") Integer estacionId, @Param("desde") LocalDateTime desde);
    
    @Query("SELECT l FROM Lectura l WHERE l.tiempo >= :desde ORDER BY l.tiempo DESC LIMIT 1000")
    List<Lectura> findRecentReadings(@Param("desde") LocalDateTime desde);
    
    @Query("SELECT MAX(l.tiempo) FROM Lectura l WHERE l.canal.idCanal = :idCanal")
    LocalDateTime findLastReadingTime(@Param("idCanal") Integer idCanal);
}
