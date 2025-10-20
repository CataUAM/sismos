package com.seismic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStationAssignmentDto {
    
    private Integer id;
    private Integer userId;
    private String username;
    private String userFullName;
    private Integer estacionId;
    private String estacionCodigo;
    private String estacionNombre;
    private Integer assignedBy;
    private LocalDateTime assignedAt;
}
