package com.seismic.repository;

import com.seismic.entity.TipoCanal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoCanalRepository extends JpaRepository<TipoCanal, Integer> {
    Optional<TipoCanal> findByCodigo(String codigo);
}
