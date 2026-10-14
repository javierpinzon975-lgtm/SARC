package com.sarc.backend.dto;

import com.sarc.backend.model.ParteMedico;
import java.util.List;

public record ParteResponse(
        Long id,
        Long citaId,
        String fechaAtencion,
        String horaAtencion,
        String fechaEmision,
        String diagnostico,
        String evolucion,
        String medicoNombre,
        String medicoId,
        List<MedicamentoRequest> medicamentos
) {
    public static ParteResponse from(ParteMedico parte) {
        return new ParteResponse(
                parte.getId(),
                parte.getCita().getId(),
                parte.getCita().getFecha().toString(),
                parte.getCita().getHora().toString(),
                parte.getEmitidoEn() == null ? null : parte.getEmitidoEn().toString(),
                parte.getDiagnostico(),
                parte.getTratamiento(),
                parte.getMedico().getNombre(),
                parte.getMedico().getIdentificacion(),
                parte.getMedicamentos().stream()
                        .map(medicamento -> new MedicamentoRequest(medicamento.getNombre(), medicamento.getCantidad()))
                        .toList()
        );
    }
}
