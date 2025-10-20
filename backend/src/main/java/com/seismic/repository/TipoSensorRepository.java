package com.seismic.repository;

import com.seismic.entity.TipoSensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoSensorRepository extends JpaRepository<TipoSensor, Integer> {
    Optional<TipoSensor> findByNombre(String nombre);
}
