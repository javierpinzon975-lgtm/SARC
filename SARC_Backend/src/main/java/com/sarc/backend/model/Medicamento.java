package com.sarc.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Medicamento {
    private String nombre;
    private String cantidad;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCantidad() {
        return cantidad;
    }

    public void setCantidad(String cantidad) {
        this.cantidad = cantidad;
    }
}
