package com.sarc.backend.repo; import com.sarc.backend.model.Usuario; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioRepository extends JpaRepository<Usuario,Long>{Optional<Usuario> findByNombreIgnoreCaseAndIdentificacion(String n,String i);boolean existsByIdentificacion(String i);}
