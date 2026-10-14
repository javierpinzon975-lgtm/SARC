package com.sarc.backend.repo;

import com.sarc.backend.model.Especialidad;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EspecialidadRepository extends JpaRepository<Especialidad, Long> {
    Optional<Especialidad> findByNombreIgnoreCase(String nombre);
}
