package com.sarc.backend.web;

import com.sarc.backend.dto.ParteRequest;
import com.sarc.backend.dto.ParteResponse;
import com.sarc.backend.service.ParteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/partes-medicos")
public class ParteController {
    private final ParteService partes;

    public ParteController(ParteService partes) {
        this.partes = partes;
    }

    @PutMapping("/{citaId}")
    public ParteResponse guardar(
            @PathVariable @NonNull Long citaId,
            @Valid @RequestBody ParteRequest solicitud
    ) {
        return partes.guardar(citaId, solicitud);
    }

    @GetMapping
    public List<ParteResponse> all() {
        return partes.all();
    }
}
