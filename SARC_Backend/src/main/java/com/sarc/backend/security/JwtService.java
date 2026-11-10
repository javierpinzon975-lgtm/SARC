package com.sarc.backend.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sarc.backend.model.Enums;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private static final long DURACION_SEGUNDOS = 12 * 60 * 60;
    private static final String ALGORITMO = "HmacSHA256";
    private final byte[] clave;
    private final ObjectMapper objectMapper;

    public JwtService(
            @Value("${app.jwt.secret}") String secreto,
            ObjectMapper objectMapper
    ) {
        this.clave = secreto.getBytes(StandardCharsets.UTF_8);
        if (clave.length < 32) {
            throw new IllegalArgumentException("JWT_SECRET debe tener al menos 32 bytes");
        }
        this.objectMapper = objectMapper;
    }

    public String crear(Long usuarioId, Enums.TipoUsuario tipo) {
        Instant ahora = Instant.now();
        try {
            String header = codificar(objectMapper.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT")));
            String payload = codificar(objectMapper.writeValueAsBytes(Map.of(
                    "sub", usuarioId.toString(),
                    "role", tipo.name(),
                    "iat", ahora.getEpochSecond(),
                    "exp", ahora.plusSeconds(DURACION_SEGUNDOS).getEpochSecond()
            )));
            String contenido = header + "." + payload;
            return contenido + "." + codificar(firmar(contenido));
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("No se pudo crear el token de sesión", exception);
        }
    }

    public Optional<AuthenticatedUser> validar(String token) {
        try {
            String[] partes = token.split("\\.", -1);
            if (partes.length != 3) return Optional.empty();

            byte[] firmaRecibida = Base64.getUrlDecoder().decode(partes[2]);
            byte[] firmaEsperada = firmar(partes[0] + "." + partes[1]);
            if (!MessageDigest.isEqual(firmaEsperada, firmaRecibida)) return Optional.empty();

            Map<?, ?> header = objectMapper.readValue(
                    Base64.getUrlDecoder().decode(partes[0]), Map.class
            );
            if (!"HS256".equals(header.get("alg")) || !"JWT".equals(header.get("typ"))) {
                return Optional.empty();
            }

            Map<?, ?> claims = objectMapper.readValue(
                    Base64.getUrlDecoder().decode(partes[1]), Map.class
            );
            long expira = ((Number) claims.get("exp")).longValue();
            if (expira <= Instant.now().getEpochSecond()) return Optional.empty();
            Long usuarioId = Long.valueOf((String) claims.get("sub"));
            Enums.TipoUsuario tipo = Enums.TipoUsuario.valueOf((String) claims.get("role"));
            return Optional.of(new AuthenticatedUser(usuarioId, tipo));
        } catch (IOException | IllegalArgumentException | ClassCastException | NullPointerException exception) {
            return Optional.empty();
        }
    }

    private byte[] firmar(String contenido) {
        try {
            Mac mac = Mac.getInstance(ALGORITMO);
            mac.init(new SecretKeySpec(clave, ALGORITMO));
            return mac.doFinal(contenido.getBytes(StandardCharsets.US_ASCII));
        } catch (java.security.GeneralSecurityException exception) {
            throw new IllegalStateException("No se pudo firmar el token de sesión", exception);
        }
    }

    private String codificar(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
