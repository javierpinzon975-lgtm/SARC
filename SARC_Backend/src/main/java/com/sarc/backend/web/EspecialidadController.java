package com.sarc.backend.web;

import com.sarc.backend.dto.EspecialidadResponse;
import com.sarc.backend.repo.EspecialidadRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/especialidades")
public class EspecialidadController {
    private final EspecialidadRepository especialidades;

    public EspecialidadController(EspecialidadRepository especialidades) {
        this.especialidades = especialidades;
    }

    @GetMapping
    public List<EspecialidadResponse> all() {
        return especialidades.findAll().stream().map(EspecialidadResponse::from).toList();
    }
}
