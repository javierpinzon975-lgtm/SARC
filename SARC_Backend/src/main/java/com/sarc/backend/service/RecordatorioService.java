package com.sarc.backend.service;

import com.sarc.backend.dto.RecordatorioResponse;
import com.sarc.backend.model.CanalRecordatorio;
import com.sarc.backend.model.Cita;
import com.sarc.backend.model.Enums;
import com.sarc.backend.repo.CitaRepository;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecordatorioService {
    private static final Duration REENVIO_MINIMO = Duration.ofMinutes(1);
    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter HORA = DateTimeFormatter.ofPattern("HH:mm");

    private final CitaRepository citas;
    private final JavaMailSender mailSender;
    private final RestClient restClient;
    private final String smtpHost;
    private final String smtpUsername;
    private final String mailFrom;
    private final String twilioAccountSid;
    private final String twilioAuthToken;
    private final String twilioSmsFrom;
    private final String twilioWhatsappFrom;
    private final ConcurrentMap<String, LocalDateTime> ultimoEnvio = new ConcurrentHashMap<>();

    public RecordatorioService(
            CitaRepository citas,
            JavaMailSender mailSender,
            RestClient.Builder restClientBuilder,
            @Value("${spring.mail.host:}") String smtpHost,
            @Value("${spring.mail.username:}") String smtpUsername,
            @Value("${app.recordatorios.mail-from:}") String mailFrom,
            @Value("${app.recordatorios.twilio-account-sid:}") String twilioAccountSid,
            @Value("${app.recordatorios.twilio-auth-token:}") String twilioAuthToken,
            @Value("${app.recordatorios.twilio-sms-from:}") String twilioSmsFrom,
            @Value("${app.recordatorios.twilio-whatsapp-from:}") String twilioWhatsappFrom
    ) {
        this.citas = citas;
        this.mailSender = mailSender;
        this.restClient = restClientBuilder.build();
        this.smtpHost = smtpHost;
        this.smtpUsername = smtpUsername;
        this.mailFrom = mailFrom.isBlank() ? smtpUsername : mailFrom;
        this.twilioAccountSid = twilioAccountSid;
        this.twilioAuthToken = twilioAuthToken;
        this.twilioSmsFrom = twilioSmsFrom;
        this.twilioWhatsappFrom = twilioWhatsappFrom;
    }

    @Transactional(readOnly = true)
    public RecordatorioResponse enviar(Long citaId, CanalRecordatorio canal) {
        Cita cita = citas.findById(citaId)
                .orElseThrow(() -> new BusinessException("Cita no existe"));
        validarCita(cita);
        validarConfiguracion(cita, canal);

        String llave = citaId + ":" + canal;
        LocalDateTime ahora = LocalDateTime.now();
        ultimoEnvio.entrySet().removeIf(entry ->
                entry.getValue().isBefore(ahora.minus(REENVIO_MINIMO))
        );
        AtomicBoolean reservado = new AtomicBoolean(false);
        LocalDateTime intento = ultimoEnvio.compute(llave, (key, anterior) -> {
            if (anterior != null && anterior.isAfter(ahora.minus(REENVIO_MINIMO))) {
                return anterior;
            }
            reservado.set(true);
            return ahora;
        });
        if (!reservado.get()) {
            throw new BusinessException("Espere un minuto antes de reenviar este recordatorio");
        }

        try {
            String mensaje = crearMensaje(cita);
            switch (canal) {
                case CORREO -> enviarCorreo(cita, mensaje);
                case SMS -> enviarTwilio(cita.getTelefonoContacto(), twilioSmsFrom, mensaje);
                case WHATSAPP -> enviarTwilio(
                        "whatsapp:" + cita.getTelefonoContacto(),
                        "whatsapp:" + quitarPrefijoWhatsapp(twilioWhatsappFrom),
                        mensaje
                );
            }
        } catch (BusinessException exception) {
            ultimoEnvio.remove(llave, intento);
            throw exception;
        } catch (MailException exception) {
            ultimoEnvio.remove(llave, intento);
            throw new BusinessException("No se pudo enviar el correo; revise la configuración SMTP");
        } catch (RestClientResponseException exception) {
            ultimoEnvio.remove(llave, intento);
            throw new BusinessException("Twilio rechazó el envío (HTTP " + exception.getStatusCode().value() + ")");
        } catch (ResourceAccessException exception) {
            ultimoEnvio.remove(llave, intento);
            throw new BusinessException("No se pudo conectar con Twilio");
        }

        return new RecordatorioResponse(canal, "ENVIADO");
    }

    private void validarCita(Cita cita) {
        if (cita.getEstado() != Enums.EstadoCita.PROGRAMADA) {
            throw new BusinessException("Solo se pueden recordar citas programadas");
        }
        if (cita.getFecha().atTime(cita.getHora()).isBefore(LocalDateTime.now())) {
            throw new BusinessException("No se puede enviar un recordatorio de una cita pasada");
        }
    }

    private void validarConfiguracion(Cita cita, CanalRecordatorio canal) {
        switch (canal) {
            case CORREO -> {
                if (smtpHost.isBlank() || mailFrom.isBlank()) {
                    throw new BusinessException("El correo no está configurado; defina SMTP_HOST y MAIL_FROM");
                }
                if (cita.getCorreoContacto() == null || cita.getCorreoContacto().isBlank()) {
                    throw new BusinessException("La cita no tiene correo de contacto");
                }
            }
            case SMS -> {
                validarTwilio();
                if (twilioSmsFrom.isBlank()) {
                    throw new BusinessException("Defina TWILIO_SMS_FROM para habilitar SMS");
                }
                validarTelefono(cita.getTelefonoContacto());
            }
            case WHATSAPP -> {
                validarTwilio();
                if (twilioWhatsappFrom.isBlank()) {
                    throw new BusinessException("Defina TWILIO_WHATSAPP_FROM para habilitar WhatsApp");
                }
                validarTelefono(cita.getTelefonoContacto());
            }
        }
    }

    private void validarTwilio() {
        if (twilioAccountSid.isBlank() || twilioAuthToken.isBlank()) {
            throw new BusinessException("Twilio no está configurado; defina TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN");
        }
    }

    private void validarTelefono(String telefono) {
        if (telefono == null || !telefono.matches("\\+[1-9]\\d{7,14}")) {
            throw new BusinessException("El teléfono debe estar en formato internacional E.164, por ejemplo +573001234567");
        }
    }

    private String crearMensaje(Cita cita) {
        return "Recordatorio de cita SARC\n"
                + "Hola " + cita.getPaciente().getNombre() + ".\n"
                + "Le esperamos el " + cita.getFecha().format(FECHA)
                + " a las " + cita.getHora().format(HORA) + ".\n"
                + "Profesional: " + cita.getMedico().getNombre() + ".\n"
                + "Por favor, llegue con anticipación.";
    }

    private void enviarCorreo(Cita cita, String mensaje) {
        SimpleMailMessage correo = new SimpleMailMessage();
        correo.setFrom(mailFrom);
        correo.setTo(cita.getCorreoContacto());
        correo.setSubject("Recordatorio de su cita médica");
        correo.setText(mensaje);
        mailSender.send(correo);
    }

    private void enviarTwilio(String destino, String origen, String mensaje) {
        MultiValueMap<String, String> formulario = new LinkedMultiValueMap<>();
        formulario.add("To", destino);
        formulario.add("From", origen);
        formulario.add("Body", mensaje);
        restClient.post()
                .uri("https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json", twilioAccountSid)
                .headers(headers -> headers.setBasicAuth(twilioAccountSid, twilioAuthToken))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formulario)
                .retrieve()
                .toBodilessEntity();
    }

    private String quitarPrefijoWhatsapp(String remitente) {
        return remitente.startsWith("whatsapp:") ? remitente.substring("whatsapp:".length()) : remitente;
    }
}
