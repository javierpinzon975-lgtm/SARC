package com.sarc.backend.web;

import com.sarc.backend.service.BusinessException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiErrorHandler {
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, String>> business(@NonNull BusinessException exception) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", Objects.toString(exception.getMessage(), "Error de negocio")));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(@NonNull MethodArgumentNotValidException exception) {
        Map<String, String> fields = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> fields.put(
                        error.getField(),
                        Objects.toString(error.getDefaultMessage(), "Valor inválido")
                ));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Validación inválida");
        body.put("campos", fields);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> other(@NonNull Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno"));
    }
}
