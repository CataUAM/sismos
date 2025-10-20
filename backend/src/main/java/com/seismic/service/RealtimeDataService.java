package com.seismic.service;

import com.seismic.dto.LecturaDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RealtimeDataService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @Async
    public void broadcastNewReading(LecturaDto lectura) {
        try {
            // Enviar datos en tiempo real via WebSocket
            messagingTemplate.convertAndSend("/topic/lecturas", lectura);
            
            // Verificar si necesita notificación por intensidad
            if (isSignificantReading(lectura)) {
                notificationService.sendSeismicAlert(lectura);
            }
            
            log.debug("Lectura enviada en tiempo real: {}", lectura.getIdLectura());
        } catch (Exception e) {
            log.error("Error enviando lectura en tiempo real", e);
        }
    }

    @Async
    public void broadcastBatchReadings(List<LecturaDto> lecturas) {
        try {
            messagingTemplate.convertAndSend("/topic/lecturas/batch", lecturas);
            
            // Verificar lecturas significativas
            lecturas.stream()
                    .filter(this::isSignificantReading)
                    .forEach(notificationService::sendSeismicAlert);
                    
            log.debug("Lote de {} lecturas enviado en tiempo real", lecturas.size());
        } catch (Exception e) {
            log.error("Error enviando lote de lecturas en tiempo real", e);
        }
    }

    private boolean isSignificantReading(LecturaDto lectura) {
        // Criterios para determinar si una lectura es significativa
        // Ejemplo: aceleración > 0.1g (0.981 m/s²)
        if (lectura.getAceleracion() != null) {
            return Math.abs(lectura.getAceleracion()) > 0.981f;
        }
        return false;
    }
}
