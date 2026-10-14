package com.sarc.backend.dto;

import com.sarc.backend.model.Cita;

public record CitaResponse(
        Long id,
        Long pacienteId,
        String pacienteIdentificacion,
        String pacienteNombre,
        String tipoIdentificacion,
        Long medicoId,
        String medicoIdentificacion,
        String medicoNombre,
        String especialidad,
        Long recepcionistaId,
        String fecha,
        String hora,
        String estado,
        String motivo,
        String telefono,
        String correo
) {
    public static CitaResponse from(Cita cita) {
        return new CitaResponse(
                cita.getId(),
                cita.getPaciente().getId(),
                cita.getPaciente().getIdentificacion(),
                cita.getPaciente().getNombre(),
                cita.getPaciente().getTipoIdentificacion(),
                cita.getMedico().getId(),
                cita.getMedico().getIdentificacion(),
                cita.getMedico().getNombre(),
                cita.getMedico().getEspecialidad() == null ? "" : cita.getMedico().getEspecialidad().getNombre(),
                cita.getRecepcionista() == null ? null : cita.getRecepcionista().getId(),
                cita.getFecha().toString(),
                cita.getHora().toString(),
                cita.getEstado().name(),
                cita.getMotivo(),
                cita.getTelefonoContacto(),
                cita.getCorreoContacto()
        );
    }
}
