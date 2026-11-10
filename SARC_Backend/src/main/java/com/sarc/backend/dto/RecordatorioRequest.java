package com.sarc.backend.dto;

import com.sarc.backend.model.CanalRecordatorio;
import jakarta.validation.constraints.NotNull;

public record RecordatorioRequest(@NotNull CanalRecordatorio canal) {}
