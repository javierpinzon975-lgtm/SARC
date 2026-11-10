package com.sarc.backend.repo;

import com.sarc.backend.model.ParteMedico;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParteRepository extends JpaRepository<ParteMedico, Long> {
    Optional<ParteMedico> findByCitaId(Long id);
    List<ParteMedico> findAllByCitaPacienteId(Long pacienteId);
    List<ParteMedico> findAllByMedicoId(Long medicoId);
}
