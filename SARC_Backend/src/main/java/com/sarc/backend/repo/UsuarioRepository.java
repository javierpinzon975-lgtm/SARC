package com.sarc.backend.repo;

import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Usuario;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNombreIgnoreCaseAndIdentificacion(String nombre, String identificacion);
    Optional<Usuario> findByIdentificacion(String identificacion);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from Usuario u where u.id = :id")
    Optional<Usuario> findByIdForUpdate(@Param("id") Long id);
    List<Usuario> findAllByTipo(Enums.TipoUsuario tipo);
    boolean existsByIdentificacion(String identificacion);
}
