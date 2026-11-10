package com.sarc.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(
        name = "pacientes",
        schema = "sarc_pacientes",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_paciente_identificacion",
                columnNames = "identificacion"
        )
)
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String identificacion;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @Column(name = "password_hash")
    private String passwordHash;

    private LocalDate fechaNacimiento;
    private String tipoIdentificacion;
    private String regimen;
    private String telefono;
    private String correo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Enums.EstadoUsuario estado = Enums.EstadoUsuario.ACTIVO;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIdentificacion() { return identificacion; }
    public void setIdentificacion(String identificacion) { this.identificacion = identificacion; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public String getTipoIdentificacion() { return tipoIdentificacion; }
    public void setTipoIdentificacion(String tipoIdentificacion) { this.tipoIdentificacion = tipoIdentificacion; }
    public String getRegimen() { return regimen; }
    public void setRegimen(String regimen) { this.regimen = regimen; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public Enums.EstadoUsuario getEstado() { return estado; }
    public void setEstado(Enums.EstadoUsuario estado) { this.estado = estado; }
}
