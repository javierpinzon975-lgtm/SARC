package com.sarc.backend.dto;

import com.sarc.backend.model.Enums;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PersonalRequest(
        @NotBlank String identificacion,
        @NotBlank String nombre,
        @NotNull Enums.TipoUsuario tipo,
        @NotBlank @Size(min = 8, max = 72) String password,
        Long especialidadId
) {}
