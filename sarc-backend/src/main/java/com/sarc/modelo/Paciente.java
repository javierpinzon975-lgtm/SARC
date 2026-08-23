package com.sarc.modelo;

import javax.persistence.*;

@Entity
@DiscriminatorValue("PACIENTE")
public class Paciente extends Usuario {

    @Column(name = "regimen")
    private String regimen; // Contributivo o Subsidiado

    public Paciente() { super(); }

    public Paciente(String id, String nombre, String regimen) {
        super(id, nombre);
        this.regimen = regimen;
    }

    public String getRegimen() { return regimen; }
    public void setRegimen(String regimen) { this.regimen = regimen; }
}
