package com.sarc.backend.dto; import jakarta.validation.constraints.*; public record ParteRequest(@NotBlank String diagnostico,@NotBlank String tratamiento,String observaciones,Long medicoId){}
