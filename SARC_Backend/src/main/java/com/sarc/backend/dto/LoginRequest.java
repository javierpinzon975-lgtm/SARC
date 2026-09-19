package com.sarc.backend.dto; import jakarta.validation.constraints.*; public record LoginRequest(@NotBlank String nombre,@NotBlank String identificacion){}
