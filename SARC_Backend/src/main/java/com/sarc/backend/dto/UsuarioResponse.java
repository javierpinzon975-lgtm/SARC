package com.sarc.backend.dto;

import com.sarc.backend.model.Usuario;
import com.sarc.backend.model.Paciente;

public record UsuarioResponse(
        Long id,
        String identificacion,
        String nombre,
        String tipo,
        String fechaNacimiento,
        String tipoIdentificacion,
        String regimen,
        String telefono,
        String correo,
        Long especialidadId,
        String especialidad,
        String accessToken
) {
    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getIdentificacion(),
                usuario.getNombre(),
                usuario.getTipo().name(),
                usuario.getFechaNacimiento() == null ? null : usuario.getFechaNacimiento().toString(),
                usuario.getTipoIdentificacion(),
                usuario.getRegimen(),
                usuario.getTelefono(),
                usuario.getCorreo(),
                usuario.getEspecialidad() == null ? null : usuario.getEspecialidad().getId(),
                usuario.getEspecialidad() == null ? null : usuario.getEspecialidad().getNombre(),
                null
        );
    }

    public static UsuarioResponse from(Paciente paciente) {
        return new UsuarioResponse(
                paciente.getId(),
                paciente.getIdentificacion(),
                paciente.getNombre(),
                "PACIENTE",
                paciente.getFechaNacimiento() == null ? null : paciente.getFechaNacimiento().toString(),
                paciente.getTipoIdentificacion(),
                paciente.getRegimen(),
                paciente.getTelefono(),
                paciente.getCorreo(),
                null,
                null,
                null
        );
    }

    public UsuarioResponse conAccessToken(String token) {
        return new UsuarioResponse(
                id,
                identificacion,
                nombre,
                tipo,
                fechaNacimiento,
                tipoIdentificacion,
                regimen,
                telefono,
                correo,
                especialidadId,
                especialidad,
                token
        );
    }
}
