package com.sarc.backend.dto;

import com.sarc.backend.model.CanalRecordatorio;

public record RecordatorioResponse(CanalRecordatorio canal, String estado) {}
