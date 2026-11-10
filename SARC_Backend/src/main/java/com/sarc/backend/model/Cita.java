package com.sarc.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "citas")
public class Cita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;
    @ManyToOne(optional = false)
    @JoinColumn(name = "medico_id", nullable = false)
    private Usuario medico;
    @ManyToOne
    @JoinColumn(name = "recepcionista_id")
    private Usuario recepcionista;
    @NotNull
    private LocalDate fecha;
    @NotNull
    private LocalTime hora;
    private String motivo;
    private String observaciones;
    private String telefonoContacto;
    private String correoContacto;
    @Enumerated(EnumType.STRING)
    private Enums.EstadoCita estado = Enums.EstadoCita.PROGRAMADA;

    public Long getId() { return id; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public Usuario getMedico() { return medico; }
    public void setMedico(Usuario medico) { this.medico = medico; }
    public Usuario getRecepcionista() { return recepcionista; }
    public void setRecepcionista(Usuario recepcionista) { this.recepcionista = recepcionista; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    public String getTelefonoContacto() { return telefonoContacto; }
    public void setTelefonoContacto(String telefonoContacto) { this.telefonoContacto = telefonoContacto; }
    public String getCorreoContacto() { return correoContacto; }
    public void setCorreoContacto(String correoContacto) { this.correoContacto = correoContacto; }
    public Enums.EstadoCita getEstado() { return estado; }
    public void setEstado(Enums.EstadoCita estado) { this.estado = estado; }
}
