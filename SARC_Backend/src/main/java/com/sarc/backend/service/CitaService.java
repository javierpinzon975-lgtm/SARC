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
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.CitaRepository;

@Service
public class CitaService {
    private final CitaRepository citas;
    private final UsuarioService usuarios;

    public CitaService(CitaRepository citas, UsuarioService usuarios) {
        this.citas = citas;
        this.usuarios = usuarios;
    }

    @Transactional
    public CitaResponse crear(CitaRequest solicitud) {
        Long pacienteId = Objects.requireNonNull(solicitud.pacienteId(), "pacienteId es obligatorio");
        Long medicoId = Objects.requireNonNull(solicitud.medicoId(), "medicoId es obligatorio");
        if (solicitud.fecha().atTime(solicitud.hora()).isBefore(LocalDateTime.now())) {
            throw new BusinessException("No se puede agendar una cita pasada");
        }

        Usuario paciente = usuarios.get(pacienteId);
        if (paciente.getTipo() != Enums.TipoUsuario.PACIENTE) {
            throw new BusinessException("El usuario seleccionado no es paciente");
        }

        Usuario medico = usuarios.get(medicoId);
        if (medico.getTipo() != Enums.TipoUsuario.MEDICO) {
            throw new BusinessException("El usuario seleccionado no es médico");
        }
        if (citas.existsByMedicoIdAndFechaAndHoraAndEstadoNot(
                medico.getId(), solicitud.fecha(), solicitud.hora(), Enums.EstadoCita.CANCELADA)) {
            throw new BusinessException("El médico ya tiene una cita activa en ese horario");
        }

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
    public CitaResponse cancelar(@NonNull Long id) {
        Cita cita = get(id);
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
    public List<CitaResponse> all() {
        return citas.findAll().stream().map(CitaResponse::from).toList();
    }
}
