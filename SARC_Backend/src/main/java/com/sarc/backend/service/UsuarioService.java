package com.sarc.backend.service;

import com.sarc.backend.dto.LoginRequest;
import com.sarc.backend.dto.UsuarioRequest;
import com.sarc.backend.dto.UsuarioResponse;
import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Especialidad;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.EspecialidadRepository;
import com.sarc.backend.repo.UsuarioRepository;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarios;
    private final EspecialidadRepository especialidades;

    public UsuarioService(UsuarioRepository usuarios, EspecialidadRepository especialidades) {
        this.usuarios = usuarios;
        this.especialidades = especialidades;
    }

    @Transactional
    public UsuarioResponse crear(UsuarioRequest solicitud) {
        if (usuarios.existsByIdentificacion(solicitud.identificacion())) {
            throw new BusinessException("La identificación ya está registrada");
        }

        if (solicitud.tipo() == Enums.TipoUsuario.PACIENTE) {
            validarDatosPaciente(solicitud);
        }

        Usuario usuario = new Usuario();
        usuario.setIdentificacion(solicitud.identificacion());
        usuario.setNombre(solicitud.nombre());
        usuario.setTipo(solicitud.tipo());
        usuario.setFechaNacimiento(solicitud.fechaNacimiento());
        usuario.setTipoIdentificacion(solicitud.tipoIdentificacion());
        usuario.setRegimen(solicitud.regimen());
        usuario.setTelefono(solicitud.telefono());
        usuario.setCorreo(solicitud.correo());

        if (solicitud.especialidadId() != null) {
            Especialidad especialidad = especialidades.findById(solicitud.especialidadId())
                    .orElseThrow(() -> new BusinessException("Especialidad no existe"));
            usuario.setEspecialidad(especialidad);
        }

        return UsuarioResponse.from(usuarios.save(usuario));
    }

    private void validarDatosPaciente(UsuarioRequest solicitud) {
        if (solicitud.fechaNacimiento() == null
                || solicitud.tipoIdentificacion() == null
                || solicitud.regimen() == null
                || solicitud.regimen().isBlank()) {
            throw new BusinessException("Fecha de nacimiento, tipo de documento y régimen son obligatorios");
        }
        if (solicitud.fechaNacimiento().isAfter(LocalDate.now())) {
            throw new BusinessException("La fecha de nacimiento no puede ser futura");
        }
        if (!List.of("REGISTRO_CIVIL", "TARJETA_IDENTIDAD", "CEDULA").contains(solicitud.tipoIdentificacion())) {
            throw new BusinessException("Tipo de documento inválido");
        }
        int edad = Period.between(solicitud.fechaNacimiento(), LocalDate.now()).getYears();
        if (edad >= 18 && !"CEDULA".equals(solicitud.tipoIdentificacion())) {
            throw new BusinessException("Las personas de 18 años o más deben registrarse con cédula");
        }
    }

    @Transactional(readOnly = true)
    public UsuarioResponse login(LoginRequest solicitud) {
        return usuarios.findByNombreIgnoreCaseAndIdentificacion(solicitud.nombre(), solicitud.identificacion())
                .map(UsuarioResponse::from)
                .orElseThrow(() -> new BusinessException("Credenciales no encontradas"));
    }

    @Transactional(readOnly = true)
    public Usuario get(Long id) {
        return usuarios.findById(id).orElseThrow(() -> new BusinessException("Usuario no existe"));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> all(Enums.TipoUsuario tipo) {
        List<Usuario> resultado = tipo == null ? usuarios.findAll() : usuarios.findAllByTipo(tipo);
        return resultado.stream().map(UsuarioResponse::from).toList();
    }

}
