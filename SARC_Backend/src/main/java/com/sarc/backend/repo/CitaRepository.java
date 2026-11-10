package com.sarc.backend.repo;

import com.sarc.backend.model.Cita;
import com.sarc.backend.model.Enums;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    boolean existsByMedicoIdAndFechaAndHoraAndEstadoNot(
            Long medicoId, LocalDate fecha, LocalTime hora, Enums.EstadoCita estado
    );
    List<Cita> findAllByPacienteId(Long pacienteId);
    List<Cita> findAllByMedicoId(Long medicoId);
}
