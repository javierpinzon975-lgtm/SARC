package com.sarc.backend.config;

import com.sarc.backend.model.Enums;
import com.sarc.backend.model.Especialidad;
import com.sarc.backend.model.Usuario;
import com.sarc.backend.repo.EspecialidadRepository;
import com.sarc.backend.repo.UsuarioRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DemoDataInitializer {
    private record Medico(String nombre, String identificacion, String especialidad) {}

    @Bean
    CommandLineRunner inicializarDatos(EspecialidadRepository especialidades, UsuarioRepository usuarios) {
        return args -> {
            List<String> nombresEspecialidad = List.of(
                    "Medicina General",
                    "Cirugía General",
                    "Pediatría",
                    "Odontología",
                    "Neurocirugía"
            );
            for (String nombre : nombresEspecialidad) {
                especialidades.findByNombreIgnoreCase(nombre).orElseGet(() -> {
                    Especialidad especialidad = new Especialidad();
                    especialidad.setNombre(nombre);
                    return especialidades.save(especialidad);
                });
            }

            List<Medico> medicos = List.of(
                    new Medico("Alejandro Torres Rojas", "1012456781", "Medicina General"),
                    new Medico("Carolina Méndez Ruiz", "1009876542", "Medicina General"),
                    new Medico("Julián Herrera Castro", "1034567890", "Medicina General"),
                    new Medico("Andrés Salazar Gómez", "1023456712", "Cirugía General"),
                    new Medico("Natalia Pardo León", "1018765439", "Cirugía General"),
                    new Medico("Felipe Cárdenas Ríos", "1045678913", "Cirugía General"),
                    new Medico("Laura Sánchez Molina", "1004567821", "Pediatría"),
                    new Medico("Sebastián Ortiz Vargas", "1021987654", "Pediatría"),
                    new Medico("Diana Ramírez Silva", "1038765412", "Pediatría"),
                    new Medico("Camilo Gutiérrez Pérez", "1013345678", "Odontología"),
                    new Medico("Valentina Moreno Díaz", "1025567891", "Odontología"),
                    new Medico("Nicolás Acosta Beltrán", "1041123456", "Odontología"),
                    new Medico("Ricardo Fernández Muñoz", "1009988776", "Neurocirugía"),
                    new Medico("Marcela Jiménez Castillo", "1022233445", "Neurocirugía"),
                    new Medico("Esteban Lozano Quintero", "1034455667", "Neurocirugía")
            );
            for (Medico medico : medicos) {
                if (usuarios.findByIdentificacion(medico.identificacion()).isEmpty()) {
                    Usuario usuario = new Usuario();
                    usuario.setIdentificacion(medico.identificacion());
                    usuario.setNombre(medico.nombre());
                    usuario.setTipo(Enums.TipoUsuario.MEDICO);
                    usuario.setEspecialidad(especialidades.findByNombreIgnoreCase(medico.especialidad()).orElseThrow());
                    usuarios.save(usuario);
                }
            }

            if (usuarios.findByIdentificacion("1116543809").isEmpty()) {
                Usuario recepcionista = new Usuario();
                recepcionista.setIdentificacion("1116543809");
                recepcionista.setNombre("Carlos Andres Medina");
                recepcionista.setTipo(Enums.TipoUsuario.RECEPCIONISTA);
                usuarios.save(recepcionista);
            }
        };
    }
