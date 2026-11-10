package com.sarc.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record MedicamentoRequest(@NotBlank String nombre, @NotBlank String cantidad) {}
