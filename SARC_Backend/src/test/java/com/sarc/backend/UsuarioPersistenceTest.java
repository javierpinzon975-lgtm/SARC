package com.sarc.backend;

import com.sarc.backend.config.PasswordConfig;
import com.sarc.backend.dto.LoginRequest;
import com.sarc.backend.dto.PersonalRequest;
import com.sarc.backend.dto.UsuarioRequest;
import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Paciente;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.PacienteRepository;
import com.sarc.backend.repo.UsuarioRepository;
import com.sarc.backend.service.BusinessException;
import com.sarc.backend.service.UsuarioService;
import com.sarc.backend.security.JwtService;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
@Import({UsuarioService.class, PasswordConfig.class, JwtService.class, JacksonAutoConfiguration.class})
@TestPropertySource(properties = "app.admin-password=test-admin-secret")
class UsuarioPersistenceTest {

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private PacienteRepository pacientes;

    @Autowired
    private UsuarioService usuarioService;

    @Test
    void persisteYConsultaUsuarioPorIdentificacion() {
        Usuario usuario = new Usuario();
        usuario.setIdentificacion("900000001");
        usuario.setNombre("Paciente de Prueba");
        usuario.setTipo(Enums.TipoUsuario.PACIENTE);

        usuarios.saveAndFlush(usuario);

        assertThat(usuarios.findByNombreIgnoreCaseAndIdentificacion(
                "paciente de prueba", "900000001"
        )).isPresent();
    }

    @Test
    void persistePacienteEnSuEsquemaSeparado() {
        Paciente paciente = new Paciente();
        paciente.setIdentificacion("900000002");
        paciente.setNombre("Paciente Separado");
        paciente.setPasswordHash("hash-de-prueba");

        pacientes.saveAndFlush(paciente);

        assertThat(pacientes.findByIdentificacion("900000002")).isPresent();
        assertThat(usuarios.findByIdentificacion("900000002")).isEmpty();
    }

    @Test
    void registraPacienteConHashYVerificaSuContrasena() {
        UsuarioRequest registro = new UsuarioRequest(
                "900000003",
                "Paciente de Login",
                Enums.TipoUsuario.PACIENTE,
                "Paciente123!",
                LocalDate.of(1990, 1, 1),
                "CEDULA",
                "Contributivo",
                null,
                null,
                null
        );

        usuarioService.crear(registro);

        Paciente almacenado = pacientes.findByIdentificacion("900000003").orElseThrow();
        assertThat(almacenado.getPasswordHash()).isNotEqualTo("Paciente123!");
        assertThat(usuarioService.login(new LoginRequest(
                "Paciente de Login", "900000003", "Paciente123!", Enums.TipoUsuario.PACIENTE
        )).tipo()).isEqualTo("PACIENTE");
        assertThatThrownBy(() -> usuarioService.login(new LoginRequest(
                "Paciente de Login", "900000003", "Incorrecta123!", Enums.TipoUsuario.PACIENTE
        ))).isInstanceOf(BusinessException.class);
    }

    @Test
    void personalRequiereClaveAdministrativaYContrasenaPropia() {
        PersonalRequest registro = new PersonalRequest(
                "900000004", "Médico de Prueba", Enums.TipoUsuario.MEDICO, "Medico123!", null
        );

        assertThatThrownBy(() -> usuarioService.crearPersonal(registro, "incorrecta"))
                .isInstanceOf(BusinessException.class);
        usuarioService.crearPersonal(registro, "test-admin-secret");

        Usuario almacenado = usuarios.findByIdentificacion("900000004").orElseThrow();
        assertThat(almacenado.getPasswordHash()).isNotEqualTo("Medico123!");
        assertThat(usuarioService.login(new LoginRequest(
                "Médico de Prueba", "900000004", "Medico123!", Enums.TipoUsuario.MEDICO
        )).tipo()).isEqualTo("MEDICO");
    }
}
