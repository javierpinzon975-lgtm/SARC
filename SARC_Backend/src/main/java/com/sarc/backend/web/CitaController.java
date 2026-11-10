package com.sarc.backend.web;

import com.sarc.backend.dto.CitaRequest;
import com.sarc.backend.dto.CitaResponse;
import com.sarc.backend.dto.RecordatorioRequest;
import com.sarc.backend.dto.RecordatorioResponse;
import com.sarc.backend.service.CitaService;
import com.sarc.backend.service.RecordatorioService;
import com.sarc.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/citas")
public class CitaController {
    private final CitaService citas;
    private final RecordatorioService recordatorios;

    public CitaController(CitaService citas, RecordatorioService recordatorios) {
        this.citas = citas;
        this.recordatorios = recordatorios;
    }

    @PostMapping
    public CitaResponse crear(
            @Valid @RequestBody CitaRequest solicitud,
            @AuthenticationPrincipal AuthenticatedUser usuario
    ) {
        return citas.crear(solicitud, usuario);
    }

    @PutMapping("/{id}/cancelar")
    public CitaResponse cancelar(
            @PathVariable @NonNull Long id,
            @AuthenticationPrincipal AuthenticatedUser usuario
    ) {
        return citas.cancelar(id, usuario);
    }

    @PostMapping("/{id}/recordatorios")
    public RecordatorioResponse enviarRecordatorio(
            @PathVariable @NonNull Long id,
            @Valid @RequestBody RecordatorioRequest solicitud,
            @AuthenticationPrincipal AuthenticatedUser usuario
    ) {
        return recordatorios.enviar(id, solicitud.canal());
    }

    @GetMapping
    public List<CitaResponse> all(@AuthenticationPrincipal AuthenticatedUser usuario) {
        return citas.all(usuario);
    }
}
