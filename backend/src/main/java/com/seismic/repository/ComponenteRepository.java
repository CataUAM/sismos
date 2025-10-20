package com.seismic.repository;

import com.seismic.entity.Componente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComponenteRepository extends JpaRepository<Componente, Integer> {
    Optional<Componente> findByNombre(String nombre);
}
