package com.sarc.backend;

import com.sarc.backend.model.CanalRecordatorio;
import com.sarc.backend.model.Cita;
import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Paciente;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.CitaRepository;
import com.sarc.backend.service.BusinessException;
import com.sarc.backend.service.RecordatorioService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RecordatorioServiceTest {
    private CitaRepository citas;
    private JavaMailSender mailSender;
    private RestClient.Builder restClientBuilder;
    private RecordatorioService recordatorios;

    @BeforeEach
    void preparar() {
        citas = mock(CitaRepository.class);
        mailSender = mock(JavaMailSender.class);
        restClientBuilder = mock(RestClient.Builder.class);
        when(restClientBuilder.build()).thenReturn(mock(RestClient.class));
        recordatorios = new RecordatorioService(
                citas,
                mailSender,
                restClientBuilder,
                "smtp.example.test",
                "clinica@example.test",
                "clinica@example.test",
                "ACtest",
                "token-test",
                "+15005550006",
                "whatsapp:+14155238886"
        );
    }

    @Test
    void enviaCorreoSinIncluirDatosClinicos() {
        Cita cita = citaValida();
        when(citas.findById(12L)).thenReturn(Optional.of(cita));

        assertThat(recordatorios.enviar(12L, CanalRecordatorio.CORREO).estado()).isEqualTo("ENVIADO");
        assertThatThrownBy(() -> recordatorios.enviar(12L, CanalRecordatorio.CORREO))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Espere un minuto");

        var mensaje = org.mockito.ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(mensaje.capture());
        assertThat(mensaje.getValue().getTo()).containsExactly("paciente@example.test");
        assertThat(mensaje.getValue().getText())
                .contains("Paciente Test", "Medico Test")
                .doesNotContain("diagnóstico", "tratamiento");
    }

    @Test
    void exigeTelefonoInternacionalAntesDeContactarTwilio() {
        Cita cita = citaValida();
        cita.setTelefonoContacto("3001234567");
        when(citas.findById(12L)).thenReturn(Optional.of(cita));

        assertThatThrownBy(() -> recordatorios.enviar(12L, CanalRecordatorio.SMS))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("formato internacional E.164");
    }

    @Test
    void enviaSmsYWhatsappPorTwilio() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer servidor = MockRestServiceServer.bindTo(builder).build();
        recordatorios = new RecordatorioService(
                citas,
                mailSender,
                builder,
                "",
                "",
                "",
                "ACtest",
                "token-test",
                "+15005550006",
                "whatsapp:+14155238886"
        );
        when(citas.findById(12L)).thenReturn(Optional.of(citaValida()));
        String endpoint = "https://api.twilio.com/2010-04-01/Accounts/ACtest/Messages.json";

        servidor.expect(requestTo(endpoint))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", org.hamcrest.Matchers.startsWith("Basic ")))
                .andExpect(content().string(containsString("To=%2B573001234567")))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));
        servidor.expect(requestTo(endpoint))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().string(containsString("To=whatsapp%3A%2B573001234567")))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        assertThat(recordatorios.enviar(12L, CanalRecordatorio.SMS).estado()).isEqualTo("ENVIADO");
        assertThat(recordatorios.enviar(12L, CanalRecordatorio.WHATSAPP).estado()).isEqualTo("ENVIADO");
        servidor.verify();
    }

    private Cita citaValida() {
        Paciente paciente = new Paciente();
        paciente.setNombre("Paciente Test");
        Usuario medico = new Usuario();
        medico.setNombre("Medico Test");

        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setMedico(medico);
        cita.setFecha(LocalDate.now().plusDays(1));
        cita.setHora(LocalTime.of(10, 30));
        cita.setEstado(Enums.EstadoCita.PROGRAMADA);
        cita.setCorreoContacto("paciente@example.test");
        cita.setTelefonoContacto("+573001234567");
        cita.setObservaciones("diagnóstico confidencial");
        return cita;
    }
}
