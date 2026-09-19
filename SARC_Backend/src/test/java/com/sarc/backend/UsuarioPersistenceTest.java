package com.sarc.backend;

import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UsuarioPersistenceTest {

    @Autowired
    private UsuarioRepository usuarios;

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
}
