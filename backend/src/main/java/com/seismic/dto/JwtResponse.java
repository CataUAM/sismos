package com.seismic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    
    private String token;
    private String refreshToken;
    @Builder.Default
    private String type = "Bearer";
    private Integer id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private List<String> roles;
    private List<EstacionDto> assignedStations;
    
    public String getFullName() {
        return (firstName != null ? firstName : "") + 
               (lastName != null ? " " + lastName : "").trim();
    }
}
