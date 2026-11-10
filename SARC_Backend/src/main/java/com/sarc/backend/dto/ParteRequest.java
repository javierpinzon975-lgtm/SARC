package com.sarc.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record ParteRequest(
        @NotBlank String diagnostico,
        String evolucion,
        String tratamiento,
        String observaciones,
        @Valid List<MedicamentoRequest> medicamentos,
        Long medicoId
) {}
