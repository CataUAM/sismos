package com.seismic.service;

import com.seismic.dto.LecturaDto;
import com.seismic.entity.User;
import com.seismic.entity.UserNotification;
import com.seismic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.notification.whatsapp.api-url:}")
    private String whatsappApiUrl;

    @Value("${app.notification.whatsapp.token:}")
    private String whatsappToken;

    @Async
    public void sendSeismicAlert(LecturaDto lectura) {
        try {
            List<User> activeUsers = userRepository.findAllActiveUsers();
            
            String subject = "Alerta Sísmica - Movimiento Detectado";
            String message = buildAlertMessage(lectura);
            
            for (User user : activeUsers) {
                if (user.getNotifications() != null) {
                    for (UserNotification notification : user.getNotifications()) {
                        if (notification.getIsActive()) {
                            switch (notification.getNotificationType()) {
                                case EMAIL:
                                    sendEmailNotification(notification.getContactInfo(), subject, message);
                                    break;
                                case WHATSAPP:
                                    sendWhatsAppNotification(notification.getContactInfo(), message);
                                    break;
                                case SMS:
                                    // Implementar SMS si es necesario
                                    log.info("SMS notification not implemented yet");
                                    break;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error enviando alertas sísmicas", e);
        }
    }

    @Async
    public void sendEmailNotification(String to, String subject, String message) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(to);
            email.setSubject(subject);
            email.setText(message);
            email.setFrom("noreply@seismic-platform.com");
            
            mailSender.send(email);
            log.info("Email enviado a: {}", to);
        } catch (Exception e) {
            log.error("Error enviando email a: " + to, e);
        }
    }

    @Async
    public void sendWhatsAppNotification(String phoneNumber, String message) {
        if (whatsappApiUrl == null || whatsappApiUrl.isEmpty()) {
            log.warn("WhatsApp API URL no configurada");
            return;
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("phone", phoneNumber);
            payload.put("message", message);
            payload.put("token", whatsappToken);

            restTemplate.postForObject(whatsappApiUrl, payload, String.class);
            log.info("WhatsApp enviado a: {}", phoneNumber);
        } catch (Exception e) {
            log.error("Error enviando WhatsApp a: " + phoneNumber, e);
        }
    }

    private String buildAlertMessage(LecturaDto lectura) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        
        StringBuilder message = new StringBuilder();
        message.append("🚨 ALERTA SÍSMICA DETECTADA 🚨\n\n");
        message.append("Estación: ").append(lectura.getEstacionCodigo()).append("\n");
        message.append("Sensor: ").append(lectura.getSensorTipo()).append("\n");
        message.append("Canal: ").append(lectura.getCanalTipo()).append(" (").append(lectura.getComponente()).append(")\n");
        message.append("Tiempo: ").append(lectura.getTiempo().format(formatter)).append("\n");
        
        if (lectura.getAceleracion() != null) {
            message.append("Aceleración: ").append(String.format("%.4f m/s²", lectura.getAceleracion())).append("\n");
        }
        if (lectura.getVelocidad() != null) {
            message.append("Velocidad: ").append(String.format("%.4f m/s", lectura.getVelocidad())).append("\n");
        }
        if (lectura.getDesplazamiento() != null) {
            message.append("Desplazamiento: ").append(String.format("%.4f m", lectura.getDesplazamiento())).append("\n");
        }
        
        message.append("\nPor favor, revise la plataforma para más detalles.");
        
        return message.toString();
    }
}
