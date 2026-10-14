package com.sarc.backend.web;

import com.sarc.backend.dto.CitaRequest;
import com.sarc.backend.dto.CitaResponse;
import com.sarc.backend.dto.EspecialidadResponse;
import com.sarc.backend.dto.LoginRequest;
import com.sarc.backend.dto.ParteRequest;
import com.sarc.backend.dto.ParteResponse;
import com.sarc.backend.dto.UsuarioRequest;
import com.sarc.backend.dto.UsuarioResponse;
import com.sarc.backend.model.Enums;
import com.sarc.backend.repo.EspecialidadRepository;
import com.sarc.backend.service.CitaService;
import com.sarc.backend.service.ParteService;
import com.sarc.backend.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
class UsuarioController {
    private final UsuarioService usuarios;

    UsuarioController(UsuarioService usuarios) {
        this.usuarios = usuarios;
    }

    @PostMapping
    UsuarioResponse crear(@Valid @RequestBody UsuarioRequest solicitud) {
        return usuarios.crear(solicitud);
    }

    @PostMapping("/login")
    UsuarioResponse login(@Valid @RequestBody LoginRequest solicitud) {
        return usuarios.login(solicitud);
    }

    @GetMapping
    List<UsuarioResponse> all(@RequestParam(name = "tipo", required = false) Enums.TipoUsuario tipo) {
        return usuarios.all(tipo);
    }
}

@RestController
@RequestMapping("/api/citas")
class CitaController {
    private final CitaService citas;

    CitaController(CitaService citas) {
        this.citas = citas;
    }

    @PostMapping
    CitaResponse crear(@Valid @RequestBody CitaRequest solicitud) {
        return citas.crear(solicitud);
    }

    @PutMapping("/{id}/cancelar")
    CitaResponse cancelar(@PathVariable Long id) {
        return citas.cancelar(id);
    }

    @GetMapping
    List<CitaResponse> all() {
        return citas.all();
    }
}

@RestController
@RequestMapping("/api/partes-medicos")
class ParteController {
    private final ParteService partes;

    ParteController(ParteService partes) {
        this.partes = partes;
    }

    @PutMapping("/{citaId}")
    ParteResponse guardar(@PathVariable Long citaId, @Valid @RequestBody ParteRequest solicitud) {
        return partes.guardar(citaId, solicitud);
    }

    @GetMapping
    List<ParteResponse> all() {
        return partes.all();
    }
}

@RestController
@RequestMapping("/api/especialidades")
class EspecialidadController {
    private final EspecialidadRepository especialidades;

    EspecialidadController(EspecialidadRepository especialidades) {
        this.especialidades = especialidades;
    }

    @GetMapping
    List<EspecialidadResponse> all() {
        return especialidades.findAll().stream().map(EspecialidadResponse::from).toList();
    }
}
