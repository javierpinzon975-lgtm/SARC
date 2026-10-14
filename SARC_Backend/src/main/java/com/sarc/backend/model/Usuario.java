package com.sarc.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(
        name = "usuarios",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_usuario_identificacion",
                columnNames = "identificacion"
        )
)
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String identificacion;

    @NotBlank
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Enums.TipoUsuario tipo;

    @Enumerated(EnumType.STRING)
    private Enums.EstadoUsuario estado = Enums.EstadoUsuario.ACTIVO;

    private LocalDate fechaNacimiento;
    private String tipoIdentificacion;
    private String regimen;

    @Enumerated(EnumType.STRING)
    private Enums.Genero genero;

    private String telefono;
    private String correo;
    private String direccion;
    private String ciudad;

    @ManyToOne
    private Especialidad especialidad;

    @Enumerated(EnumType.STRING)
    private Enums.Turno turno;

    public Long getId() {
        return id;
    }

    public String getIdentificacion() {
        return identificacion;
    }

    public void setIdentificacion(String identificacion) {
        this.identificacion = identificacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Enums.TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(Enums.TipoUsuario tipo) {
        this.tipo = tipo;
    }

    public Enums.EstadoUsuario getEstado() {
        return estado;
    }

    public void setEstado(Enums.EstadoUsuario estado) {
        this.estado = estado;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getTipoIdentificacion() {
        return tipoIdentificacion;
    }

    public void setTipoIdentificacion(String tipoIdentificacion) {
        this.tipoIdentificacion = tipoIdentificacion;
    }

    public String getRegimen() {
        return regimen;
    }

    public void setRegimen(String regimen) {
        this.regimen = regimen;
    }

    public Enums.Genero getGenero() {
        return genero;
    }

    public void setGenero(Enums.Genero genero) {
        this.genero = genero;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public Especialidad getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(Especialidad especialidad) {
        this.especialidad = especialidad;
    }

    public Enums.Turno getTurno() {
        return turno;
    }

    public void setTurno(Enums.Turno turno) {
        this.turno = turno;
    }
}
