package com.sarc.backend;

import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Paciente;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.PacienteRepository;
import com.sarc.backend.repo.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class DatabaseMigrationTest {
    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private PacienteRepository pacientes;

    @Autowired
    private CommandLineRunner inicializador;

    @Test
    void migraPacientesAntiguosConservandoIdentificadorYPermiteRepeticion() throws Exception {
        Usuario antiguo = new Usuario();
        antiguo.setIdentificacion("900000005");
        antiguo.setNombre("Paciente Migrado");
        antiguo.setTipo(Enums.TipoUsuario.PACIENTE);
        antiguo = usuarios.saveAndFlush(antiguo);

        inicializador.run();
        inicializador.run();

        Paciente migrado = pacientes.findByIdentificacion("900000005").orElseThrow();
        assertThat(migrado.getId()).isEqualTo(antiguo.getId());
        assertThat(migrado.getPasswordHash()).isNull();
    }
}
