package com.sarc.backend.dto;

import com.sarc.backend.model.Usuario;

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
        String especialidad
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
                usuario.getEspecialidad() == null ? null : usuario.getEspecialidad().getNombre()
        );
    }
}
