package com.sarc.backend.security;

import com.sarc.backend.model.Enums;

public record AuthenticatedUser(Long id, Enums.TipoUsuario tipo) {}
