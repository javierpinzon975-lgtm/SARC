package com.sarc.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sarc.backend.security.JwtAuthenticationFilter;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(
            JwtAuthenticationFilter jwtFilter
    ) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(jwtFilter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtFilter,
            ObjectMapper objectMapper
    ) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            objectMapper.writeValue(response.getOutputStream(), Map.of(
                                    "error", "Se requiere una sesión válida"
                            ));
                        })
                        .accessDeniedHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            objectMapper.writeValue(response.getOutputStream(), Map.of(
                                    "error", "No tiene permisos para realizar esta operación"
                            ));
                        })
                )
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/usuarios", "/api/usuarios/login", "/api/usuarios/personal").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/medicos", "/api/especialidades").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.GET, "/api/citas").hasAnyRole("PACIENTE", "MEDICO", "RECEPCIONISTA")
                        .requestMatchers(HttpMethod.POST, "/api/citas").hasRole("PACIENTE")
                        .requestMatchers(HttpMethod.PUT, "/api/citas/*/cancelar").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.POST, "/api/citas/*/recordatorios").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.GET, "/api/partes-medicos")
                        .hasAnyRole("PACIENTE", "MEDICO", "RECEPCIONISTA")
                        .requestMatchers(HttpMethod.PUT, "/api/partes-medicos/*").hasRole("MEDICO")
                        .anyRequest().denyAll()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
