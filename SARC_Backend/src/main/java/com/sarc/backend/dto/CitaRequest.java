package com.sarc.backend.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record CitaRequest(
        @NotNull Long pacienteId,
        @NotNull Long medicoId,
        Long recepcionistaId,
        @NotNull @FutureOrPresent LocalDate fecha,
        @NotNull LocalTime hora,
        String motivo,
        @NotBlank String telefono,
        @NotBlank @Email String correo
) {
    public CitaRequest(Long pacienteId, Long medicoId, Long recepcionistaId, LocalDate fecha, LocalTime hora, String motivo) {
        this(pacienteId, medicoId, recepcionistaId, fecha, hora, motivo, null, null);
    }
}
