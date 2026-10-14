package com.sarc.backend.web;

import com.sarc.backend.dto.CitaRequest;
import com.sarc.backend.dto.CitaResponse;
import com.sarc.backend.service.CitaService;
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

@RestController
@RequestMapping("/api/citas")
public class CitaController {
    private final CitaService citas;

    public CitaController(CitaService citas) {
        this.citas = citas;
    }

    @PostMapping
    public CitaResponse crear(@Valid @RequestBody CitaRequest solicitud) {
        return citas.crear(solicitud);
    }

    @PutMapping("/{id}/cancelar")
    public CitaResponse cancelar(@PathVariable @NonNull Long id) {
        return citas.cancelar(id);
    }

    @GetMapping
    public List<CitaResponse> all() {
        return citas.all();
    }
}
