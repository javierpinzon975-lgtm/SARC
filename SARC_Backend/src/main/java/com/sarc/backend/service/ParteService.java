package com.sarc.backend.service;

import com.sarc.backend.dto.MedicamentoRequest;
import com.sarc.backend.dto.ParteRequest;
import com.sarc.backend.dto.ParteResponse;
import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Medicamento;
import com.sarc.backend.model.ParteMedico;
import com.sarc.backend.repo.ParteRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ParteService {
    private final ParteRepository partes;
    private final CitaService citas;

    public ParteService(ParteRepository partes, CitaService citas) {
        this.partes = partes;
        this.citas = citas;
    }

    @Transactional
    public ParteResponse guardar(@NonNull Long citaId, ParteRequest solicitud) {
        var cita = citas.get(citaId);
        if (cita.getFecha().atTime(cita.getHora()).isAfter(LocalDateTime.now())) {
            throw new BusinessException("La cita aún no ha sido atendida");
        }
        if (solicitud.medicoId() != null && !cita.getMedico().getId().equals(solicitud.medicoId())) {
            throw new BusinessException("El médico no coincide con la cita");
        }

        String evolucion = solicitud.evolucion() == null ? solicitud.tratamiento() : solicitud.evolucion();
        if (evolucion == null || evolucion.isBlank()) {
            throw new BusinessException("La evolución o tratamiento es obligatorio");
        }

        ParteMedico parte = partes.findByCitaId(citaId).orElseGet(ParteMedico::new);
        parte.setCita(cita);
        parte.setMedico(cita.getMedico());
        parte.setDiagnostico(solicitud.diagnostico());
        parte.setTratamiento(evolucion);
        parte.setObservaciones(solicitud.observaciones());
        List<Medicamento> medicamentos = (solicitud.medicamentos() == null ? List.<MedicamentoRequest>of() : solicitud.medicamentos())
                .stream()
                .map(this::crearMedicamento)
                .toList();
        parte.getMedicamentos().clear();
        parte.getMedicamentos().addAll(medicamentos);
        parte.setEmitidoEn(LocalDateTime.now());
        cita.setEstado(Enums.EstadoCita.COMPLETADA);
        return ParteResponse.from(partes.save(parte));
    }

    @Transactional(readOnly = true)
    public List<ParteResponse> all() {
        return partes.findAll().stream().map(ParteResponse::from).toList();
    }

    private Medicamento crearMedicamento(MedicamentoRequest solicitud) {
        Medicamento medicamento = new Medicamento();
        medicamento.setNombre(solicitud.nombre());
        medicamento.setCantidad(solicitud.cantidad());
        return medicamento;
    }
}
