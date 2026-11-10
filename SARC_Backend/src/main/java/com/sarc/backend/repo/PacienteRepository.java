package com.sarc.backend.repo;

import com.sarc.backend.model.Paciente;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByNombreIgnoreCaseAndIdentificacion(String nombre, String identificacion);
    Optional<Paciente> findByIdentificacion(String identificacion);
    List<Paciente> findAllByOrderById();
    boolean existsByIdentificacion(String identificacion);
}
