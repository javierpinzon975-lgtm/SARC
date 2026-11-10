package com.sarc.backend.dto;

import com.sarc.backend.model.Enums;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotBlank String nombre,
        @NotBlank String identificacion,
        @NotBlank String password,
        @NotNull Enums.TipoUsuario tipo
) {}
