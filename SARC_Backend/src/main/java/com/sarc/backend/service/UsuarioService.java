package com.sarc.backend.service;

import com.sarc.backend.dto.LoginRequest;
import com.sarc.backend.dto.PersonalRequest;
import com.sarc.backend.dto.UsuarioRequest;
import com.sarc.backend.dto.UsuarioResponse;
import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Especialidad;
import com.sarc.backend.model.Paciente;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.EspecialidadRepository;
import com.sarc.backend.repo.PacienteRepository;
import com.sarc.backend.repo.UsuarioRepository;
import com.sarc.backend.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarios;
    private final PacienteRepository pacientes;
    private final EspecialidadRepository especialidades;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String adminPassword;

    public UsuarioService(
            UsuarioRepository usuarios,
            PacienteRepository pacientes,
            EspecialidadRepository especialidades,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${app.admin-password:}") String adminPassword
    ) {
        this.usuarios = usuarios;
        this.pacientes = pacientes;
        this.especialidades = especialidades;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.adminPassword = adminPassword;
    }

    @Transactional
    public UsuarioResponse crear(UsuarioRequest solicitud) {
        if (solicitud.tipo() != Enums.TipoUsuario.PACIENTE) {
            throw new BusinessException("Las cuentas de personal solo pueden ser creadas por administración");
        }
        validarDatosPaciente(solicitud);
        Paciente paciente = pacientes.findByIdentificacion(solicitud.identificacion()).orElse(null);
        if (paciente != null) {
            if (paciente.getPasswordHash() != null
                    || !paciente.getNombre().equalsIgnoreCase(solicitud.nombre())) {
                throw new BusinessException("La identificación ya está registrada");
            }
        } else {
            paciente = new Paciente();
        }
        paciente.setIdentificacion(solicitud.identificacion());
        paciente.setNombre(solicitud.nombre());
        paciente.setPasswordHash(passwordEncoder.encode(solicitud.password()));
        paciente.setFechaNacimiento(solicitud.fechaNacimiento());
        paciente.setTipoIdentificacion(solicitud.tipoIdentificacion());
        paciente.setRegimen(solicitud.regimen());
        paciente.setTelefono(solicitud.telefono());
        paciente.setCorreo(solicitud.correo());
        return UsuarioResponse.from(pacientes.save(paciente));
    }

    @Transactional
    public UsuarioResponse crearPersonal(PersonalRequest solicitud, String claveAdmin) {
        validarClaveAdmin(claveAdmin);
        if (solicitud.tipo() != Enums.TipoUsuario.MEDICO
                && solicitud.tipo() != Enums.TipoUsuario.RECEPCIONISTA) {
            throw new BusinessException("El tipo de cuenta de personal no es válido");
        }

        Usuario usuario = usuarios.findByIdentificacion(solicitud.identificacion()).orElseGet(Usuario::new);
        if (usuario.getId() != null
                && (usuario.getTipo() != solicitud.tipo() || usuario.getPasswordHash() != null)) {
            throw new BusinessException("La identificación ya está registrada para otra cuenta");
        }
        usuario.setIdentificacion(solicitud.identificacion());
        usuario.setNombre(solicitud.nombre());
        usuario.setTipo(solicitud.tipo());
        usuario.setPasswordHash(passwordEncoder.encode(solicitud.password()));
        if (solicitud.tipo() == Enums.TipoUsuario.RECEPCIONISTA) {
            usuario.setEspecialidad(null);
        }
        if (solicitud.especialidadId() != null) {
            if (solicitud.tipo() != Enums.TipoUsuario.MEDICO) {
                throw new BusinessException("Solo los médicos pueden tener especialidad");
            }
            Especialidad especialidad = especialidades.findById(solicitud.especialidadId())
                    .orElseThrow(() -> new BusinessException("Especialidad no existe"));
            usuario.setEspecialidad(especialidad);
        }
        return UsuarioResponse.from(usuarios.save(usuario));
    }

    private void validarClaveAdmin(String claveAdmin) {
        if (adminPassword.isBlank()) {
            throw new BusinessException("La clave administrativa no está configurada en el servidor");
        }
        if (claveAdmin == null || !MessageDigest.isEqual(
                adminPassword.getBytes(StandardCharsets.UTF_8),
                claveAdmin.getBytes(StandardCharsets.UTF_8))) {
            throw new BusinessException("Clave administrativa inválida");
        }
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
        if (solicitud.tipo() == Enums.TipoUsuario.PACIENTE) {
            Paciente paciente = pacientes.findByNombreIgnoreCaseAndIdentificacion(
                            solicitud.nombre(), solicitud.identificacion())
                    .orElseThrow(() -> new BusinessException("Credenciales no encontradas"));
            if (paciente.getPasswordHash() == null
                    || !passwordEncoder.matches(solicitud.password(), paciente.getPasswordHash())) {
                throw new BusinessException("Credenciales no encontradas");
            }
            return UsuarioResponse.from(paciente).conAccessToken(jwtService.crear(paciente.getId(), solicitud.tipo()));
        }

        if (solicitud.tipo() != Enums.TipoUsuario.MEDICO
                && solicitud.tipo() != Enums.TipoUsuario.RECEPCIONISTA) {
            throw new BusinessException("Tipo de usuario inválido");
        }
        Usuario usuario = usuarios.findByNombreIgnoreCaseAndIdentificacion(
                        solicitud.nombre(), solicitud.identificacion())
                .filter(actual -> actual.getTipo() == solicitud.tipo())
                .orElseThrow(() -> new BusinessException("Credenciales no encontradas"));
        if (usuario.getPasswordHash() == null
                || !passwordEncoder.matches(solicitud.password(), usuario.getPasswordHash())) {
            throw new BusinessException("Credenciales no encontradas");
        }
        return UsuarioResponse.from(usuario).conAccessToken(jwtService.crear(usuario.getId(), solicitud.tipo()));
    }

    @Transactional(readOnly = true)
    public Usuario get(@NonNull Long id) {
        return usuarios.findById(id).orElseThrow(() -> new BusinessException("Usuario no existe"));
    }

    @Transactional
    public Usuario getForUpdate(@NonNull Long id) {
        return usuarios.findByIdForUpdate(id).orElseThrow(() -> new BusinessException("Usuario no existe"));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> all(Enums.TipoUsuario tipo) {
        List<UsuarioResponse> resultado = new ArrayList<>();
        if (tipo == null || tipo == Enums.TipoUsuario.PACIENTE) {
            resultado.addAll(pacientes.findAllByOrderById().stream().map(UsuarioResponse::from).toList());
        }
        if (tipo == null || tipo != Enums.TipoUsuario.PACIENTE) {
            List<Usuario> personal = tipo == null
                    ? usuarios.findAll().stream()
                            .filter(usuario -> usuario.getTipo() != Enums.TipoUsuario.PACIENTE)
                            .toList()
                    : usuarios.findAllByTipo(tipo);
            resultado.addAll(personal.stream().map(UsuarioResponse::from).toList());
        }
        return resultado;
    }

}
