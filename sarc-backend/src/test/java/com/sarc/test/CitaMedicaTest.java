package com.sarc.test;

import com.sarc.modelo.CitaMedica;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.*;

public class CitaMedicaTest {

    private static SessionFactory factory;

    @BeforeClass
    public static void setUp() {
        factory = new Configuration().configure("hibernate.cfg.xml").buildSessionFactory();
    }

    @Test
    public void testCrearYCancelarCita() {
        Session session = factory.openSession();
        session.beginTransaction();

        CitaMedica cita = new CitaMedica();
        cita.setIdCita("TEST-CITA-01");
        cita.setMedicoId("1004567821");
        cita.setMedicoNombre("Laura Sánchez Molina");
        cita.setEspecialidad("Pediatría");
        cita.setFecha("2026-07-01");
        cita.setHora("09:00 AM");
        cita.setEstado("Confirmada");

        session.save(cita);
        session.getTransaction().commit();

        // Validar inserción
        CitaMedica citaGuardada = session.get(CitaMedica.class, "TEST-CITA-01");
        assertNotNull("La cita debe existir en base de datos", citaGuardada);
        assertEquals("Confirmada", citaGuardada.getEstado());

        // Validar cambio de estado
        session.beginTransaction();
        citaGuardada.setEstado("Cancelada");
        session.update(citaGuardada);
        session.getTransaction().commit();

        CitaMedica citaCancelada = session.get(CitaMedica.class, "TEST-CITA-01");
        assertEquals("Cancelada", citaCancelada.getEstado());
        
        session.close();
    }

    @AfterClass
    public static void tearDown() {
        if (factory != null) factory.close();
    }
}
