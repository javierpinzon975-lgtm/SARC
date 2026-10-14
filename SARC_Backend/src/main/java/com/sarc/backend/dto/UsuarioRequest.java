package com.sarc.backend.dto;

import com.sarc.backend.model.Enums;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record UsuarioRequest(
        @NotBlank String identificacion,
        @NotBlank String nombre,
        @NotNull Enums.TipoUsuario tipo,
        LocalDate fechaNacimiento,
        String tipoIdentificacion,
        String regimen,
        String telefono,
        @Email String correo,
        Long especialidadId
) {}
