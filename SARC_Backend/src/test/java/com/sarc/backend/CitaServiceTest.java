package com.sarc.backend;

import com.sarc.backend.dto.CitaRequest;
import com.sarc.backend.model.Cita;
import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Paciente;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.CitaRepository;
import com.sarc.backend.repo.PacienteRepository;
import com.sarc.backend.service.BusinessException;
import com.sarc.backend.service.CitaService;
import com.sarc.backend.service.UsuarioService;
import com.sarc.backend.security.AuthenticatedUser;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;

class CitaServiceTest {
    @Mock
    private CitaRepository repo;
    @Mock
    private UsuarioService users;
    @Mock
    private PacienteRepository patients;
    private CitaService service;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
        service = new CitaService(repo, users, patients);
    }

    @Test
    void rechazaPasado() {
        var solicitud = new CitaRequest(
                1L, 2L, null, LocalDate.now().minusDays(1), LocalTime.NOON, ""
        );
        assertThrows(BusinessException.class, () -> service.crear(
                solicitud, new AuthenticatedUser(1L, Enums.TipoUsuario.PACIENTE)
        ));
    }

    @Test
    void evitaDobleReserva() {
        Paciente paciente = new Paciente();
        Usuario medico = new Usuario();
        medico.setTipo(Enums.TipoUsuario.MEDICO);
        when(patients.findById(1L)).thenReturn(Optional.of(paciente));
        when(users.getForUpdate(2L)).thenReturn(medico);
        when(repo.existsByMedicoIdAndFechaAndHoraAndEstadoNot(
                isNull(), any(), any(), eq(Enums.EstadoCita.CANCELADA)
        )).thenReturn(true);

        var solicitud = new CitaRequest(
                1L, 2L, null, LocalDate.now().plusDays(1), LocalTime.NOON, ""
        );
        assertThrows(BusinessException.class, () -> service.crear(
                solicitud, new AuthenticatedUser(1L, Enums.TipoUsuario.PACIENTE)
        ));
        org.mockito.Mockito.verify(users).getForUpdate(2L);
    }
}
