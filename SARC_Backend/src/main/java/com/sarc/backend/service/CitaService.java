package com.sarc.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sarc.backend.dto.CitaRequest;
import com.sarc.backend.dto.CitaResponse;
import com.sarc.backend.model.Cita;
import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Paciente;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.CitaRepository;
import com.sarc.backend.repo.PacienteRepository;
import com.sarc.backend.security.AuthenticatedUser;

@Service
public class CitaService {
    private final CitaRepository citas;
    private final UsuarioService usuarios;
    private final PacienteRepository pacientes;

    public CitaService(CitaRepository citas, UsuarioService usuarios, PacienteRepository pacientes) {
        this.citas = citas;
        this.usuarios = usuarios;
        this.pacientes = pacientes;
    }

    @Transactional
    public CitaResponse crear(CitaRequest solicitud, AuthenticatedUser usuarioActual) {
        Long pacienteId = Objects.requireNonNull(solicitud.pacienteId(), "pacienteId es obligatorio");
        Long medicoId = Objects.requireNonNull(solicitud.medicoId(), "medicoId es obligatorio");
        if (usuarioActual.tipo() != Enums.TipoUsuario.PACIENTE || !usuarioActual.id().equals(pacienteId)) {
            throw new BusinessException("Solo puede agendar citas para su propia cuenta de paciente");
        }
        if (solicitud.fecha().atTime(solicitud.hora()).isBefore(LocalDateTime.now())) {
            throw new BusinessException("No se puede agendar una cita pasada");
        }

        Usuario medico = usuarios.getForUpdate(medicoId);
        if (medico.getTipo() != Enums.TipoUsuario.MEDICO) {
            throw new BusinessException("El usuario seleccionado no es médico");
        }
        if (citas.existsByMedicoIdAndFechaAndHoraAndEstadoNot(
                medico.getId(), solicitud.fecha(), solicitud.hora(), Enums.EstadoCita.CANCELADA)) {
            throw new BusinessException("El médico ya tiene una cita activa en ese horario");
        }

        Paciente paciente = pacientes.findById(pacienteId)
                .orElseThrow(() -> new BusinessException("El paciente seleccionado no existe"));

        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setMedico(medico);
        Long recepcionistaId = solicitud.recepcionistaId();
        if (recepcionistaId != null) {
            Usuario recepcionista = usuarios.get(recepcionistaId);
            if (recepcionista.getTipo() != Enums.TipoUsuario.RECEPCIONISTA) {
                throw new BusinessException("El usuario seleccionado no es recepcionista");
            }
            cita.setRecepcionista(recepcionista);
        }
        cita.setFecha(solicitud.fecha());
        cita.setHora(solicitud.hora());
        cita.setMotivo(solicitud.motivo());
        cita.setTelefonoContacto(solicitud.telefono());
        cita.setCorreoContacto(solicitud.correo());
        return CitaResponse.from(citas.save(cita));
    }

    @Transactional
    public CitaResponse cancelar(@NonNull Long id, AuthenticatedUser usuarioActual) {
        Cita cita = get(id);
        if (usuarioActual.tipo() == Enums.TipoUsuario.PACIENTE
                && !cita.getPaciente().getId().equals(usuarioActual.id())) {
            throw new BusinessException("No puede cancelar citas de otro paciente");
        }
        if (cita.getEstado() != Enums.EstadoCita.CANCELADA) {
            cita.setEstado(Enums.EstadoCita.CANCELADA);
            citas.save(cita);
        }
        return CitaResponse.from(cita);
    }

    @Transactional(readOnly = true)
    public Cita get(@NonNull Long id) {
        return citas.findById(id).orElseThrow(() -> new BusinessException("Cita no existe"));
    }

    @Transactional(readOnly = true)
    public List<CitaResponse> all(AuthenticatedUser usuarioActual) {
        List<Cita> resultado = switch (usuarioActual.tipo()) {
            case PACIENTE -> citas.findAllByPacienteId(usuarioActual.id());
            case MEDICO -> citas.findAllByMedicoId(usuarioActual.id());
            case RECEPCIONISTA -> citas.findAll();
        };
        boolean incluirFechaNacimiento = usuarioActual.tipo() == Enums.TipoUsuario.MEDICO;
        return resultado.stream()
                .map(cita -> CitaResponse.from(cita, incluirFechaNacimiento))
                .toList();
    }
}
