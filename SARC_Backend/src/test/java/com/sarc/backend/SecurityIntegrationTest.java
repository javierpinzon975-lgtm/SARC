package com.sarc.backend;

import com.sarc.backend.model.Enums;
import com.sarc.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Test
    void rechazaCitasSinTokenYPermiteConsultarlasConTokenValido() throws Exception {
        mockMvc.perform(get("/api/citas"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/citas")
                        .header(HttpHeaders.AUTHORIZATION,
                                "Bearer " + jwtService.crear(44L, Enums.TipoUsuario.PACIENTE)))
                .andExpect(status().isOk());
    }

    @Test
    void mantienePublicasLasEspecialidadesYLaListaDeMedicos() throws Exception {
        mockMvc.perform(get("/api/especialidades"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/usuarios/medicos"))
                .andExpect(status().isOk());
    }

    @Test
    void respondeCorsAlPreflightDeVite() throws Exception {
        mockMvc.perform(options("/api/citas")
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    @Test
    void rechazaTokensInvalidosYOperacionesFueraDelRol() throws Exception {
        String tokenPaciente = "Bearer " + jwtService.crear(44L, Enums.TipoUsuario.PACIENTE);

        mockMvc.perform(get("/api/citas").header(HttpHeaders.AUTHORIZATION, "Bearer invalido"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/usuarios").header(HttpHeaders.AUTHORIZATION, tokenPaciente))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/citas/1/recordatorios")
                        .header(HttpHeaders.AUTHORIZATION, tokenPaciente)
                        .contentType("application/json")
                        .content("{\"canal\":\"SMS\"}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(put("/api/partes-medicos/1")
                        .header(HttpHeaders.AUTHORIZATION, tokenPaciente)
                        .contentType("application/json")
                        .content("{}"))
                .andExpect(status().isForbidden());
    }
}
