package com.seismic.repository;

import com.seismic.entity.UserEstacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEstacionRepository extends JpaRepository<UserEstacion, Integer> {

    @Query("SELECT ue FROM UserEstacion ue WHERE ue.user.idUser = :userId")
    List<UserEstacion> findByUserId(@Param("userId") Integer userId);

    @Query("SELECT ue FROM UserEstacion ue WHERE ue.estacion.idEstacion = :estacionId")
    List<UserEstacion> findByEstacionId(@Param("estacionId") Integer estacionId);

    @Query("SELECT ue FROM UserEstacion ue WHERE ue.user.idUser = :userId AND ue.estacion.idEstacion = :estacionId")
    UserEstacion findByUserIdAndEstacionId(@Param("userId") Integer userId, @Param("estacionId") Integer estacionId);

    @Query("DELETE FROM UserEstacion ue WHERE ue.user.idUser = :userId AND ue.estacion.idEstacion = :estacionId")
    void deleteByUserIdAndEstacionId(@Param("userId") Integer userId, @Param("estacionId") Integer estacionId);
}
