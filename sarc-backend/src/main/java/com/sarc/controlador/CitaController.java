package com.sarc.controlador;

import com.sarc.modelo.CitaMedica;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/CitaController")
public class CitaController extends HttpServlet {

    private static SessionFactory factory;

    @Override
    public void init() throws ServletException {
        factory = new Configuration().configure().buildSessionFactory();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("agendar".equals(action)) {
            agendarCita(request, response);
        } else if ("cancelar".equals(action)) {
            cancelarCita(request, response);
        }
    }

    private void agendarCita(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        Session session = factory.getCurrentSession();
        try {
            session.beginTransaction();

            CitaMedica cita = new CitaMedica();
            cita.setIdCita("CITA-" + System.currentTimeMillis());
            cita.setMedicoId(request.getParameter("medicoId"));
            cita.setMedicoNombre(request.getParameter("medicoNombre"));
            cita.setEspecialidad(request.getParameter("especialidad"));
            cita.setFecha(request.getParameter("fecha"));
            cita.setHora(request.getParameter("hora"));
            cita.setCelular(request.getParameter("celular"));
            cita.setCorreo(request.getParameter("correo"));
            cita.setEstado("Confirmada");

            session.save(cita);
            session.getTransaction().commit();

            response.getWriter().write("{\"status\": \"success\", \"message\": \"Cita agendada correctamente\"}");
        } catch (Exception e) {
            if (session.getTransaction() != null) session.getTransaction().rollback();
            response.getWriter().write("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    private void cancelarCita(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        String idCita = request.getParameter("idCita");
        Session session = factory.getCurrentSession();
        try {
            session.beginTransaction();
            CitaMedica cita = session.get(CitaMedica.class, idCita);
            if (cita != null) {
                cita.setEstado("Cancelada");
                session.update(cita);
            }
            session.getTransaction().commit();
            response.getWriter().write("{\"status\": \"success\", \"message\": \"Cita cancelada correctamente\"}");
        } catch (Exception e) {
            if (session.getTransaction() != null) session.getTransaction().rollback();
            response.getWriter().write("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    @Override
    public void destroy() {
        if (factory != null) factory.close();
    }
}
