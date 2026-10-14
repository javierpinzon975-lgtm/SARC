package com.sarc.backend.repo;

import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNombreIgnoreCaseAndIdentificacion(String nombre, String identificacion);
    Optional<Usuario> findByIdentificacion(String identificacion);
    List<Usuario> findAllByTipo(Enums.TipoUsuario tipo);
    boolean existsByIdentificacion(String identificacion);
}
