package com.sarc.backend.web;

import com.sarc.backend.dto.LoginRequest;
import com.sarc.backend.dto.UsuarioRequest;
import com.sarc.backend.dto.UsuarioResponse;
import com.sarc.backend.model.Enums;
import com.sarc.backend.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService usuarios;

    public UsuarioController(UsuarioService usuarios) {
        this.usuarios = usuarios;
    }

    @PostMapping
    public UsuarioResponse crear(@Valid @RequestBody UsuarioRequest solicitud) {
        return usuarios.crear(solicitud);
    }

    @PostMapping("/login")
    public UsuarioResponse login(@Valid @RequestBody LoginRequest solicitud) {
        return usuarios.login(solicitud);
    }

    @GetMapping
    public List<UsuarioResponse> all(@RequestParam(name = "tipo", required = false) Enums.TipoUsuario tipo) {
        return usuarios.all(tipo);
    }
}
