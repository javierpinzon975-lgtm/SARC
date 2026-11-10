-- Inicialización de las dos bases de datos del sistema SARC.
-- Ejecute este archivo en MySQL antes de iniciar el backend.

CREATE DATABASE IF NOT EXISTS proyecto_sarc_api
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS sarc_pacientes
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sarc_pacientes.pacientes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    identificacion VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NULL,
    fecha_nacimiento DATE NULL,
    tipo_identificacion VARCHAR(255) NULL,
    regimen VARCHAR(255) NULL,
    telefono VARCHAR(255) NULL,
    correo VARCHAR(255) NULL,
    estado VARCHAR(255) NOT NULL DEFAULT 'ACTIVO',
    PRIMARY KEY (id),
    CONSTRAINT uk_paciente_identificacion UNIQUE (identificacion)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
