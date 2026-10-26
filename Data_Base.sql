-- ============================================================
-- BASE DE DATOS: Proyecto SARC (Sistema de Atención y Registro Clínico)
-- Compatible con Spring Boot JPA y React Frontend
-- ============================================================

CREATE DATABASE IF NOT EXISTS bel11wla7q7qfhb6lt2q
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bel11wla7q7qfhb6lt2q;

SET NAMES utf8mb4;

-- ============================================================
-- 1. ROLES DEL SISTEMA
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. ESPECIALIDADES MÉDICAS
-- ============================================================
CREATE TABLE IF NOT EXISTS especialidades (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. USUARIOS DEL SISTEMA (COMPATIBLE CON JPA ENTITY USUARIO.JAVA)
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    telefono VARCHAR(20),
    tipo ENUM('PACIENTE', 'MEDICO', 'RECEPCIONISTA', 'ADMINISTRADOR') NOT NULL DEFAULT 'PACIENTE',
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    tipo_identificacion VARCHAR(50) DEFAULT 'CEDULA_CIUDADANIA',
    fecha_nacimiento DATE NULL,
    regimen VARCHAR(50) NULL,
    genero ENUM('MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERE_NO_DECIR') DEFAULT 'OTRO',
    direccion VARCHAR(255) NULL,
    ciudad VARCHAR(100) NULL,
    especialidad_id INT NULL,
    turno ENUM('MAÑANA', 'TARDE', 'NOCHE', 'ROTATIVO') NULL,
    id_rol INT NULL,
    ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_usuario_identificacion UNIQUE (identificacion),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_usuarios_especialidad FOREIGN KEY (especialidad_id)
        REFERENCES especialidades(id_especialidad) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_identificacion ON usuarios(identificacion);

-- ============================================================
-- 4. CITAS MÉDICAS (COMPATIBLE CON JPA ENTITY CITA.JAVA)
-- ============================================================
CREATE TABLE IF NOT EXISTS citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    medico_id BIGINT NOT NULL,
    recepcionista_id BIGINT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT NULL,
    observaciones TEXT NULL,
    telefono_contacto VARCHAR(20) NULL,
    correo_contacto VARCHAR(150) NULL,
    estado ENUM('PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'NOSHOW') DEFAULT 'PROGRAMADA',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_citas_paciente FOREIGN KEY (paciente_id)
        REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_citas_medico FOREIGN KEY (medico_id)
        REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_citas_recepcionista FOREIGN KEY (recepcionista_id)
        REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_citas_fecha ON citas(fecha, hora);
CREATE INDEX idx_citas_medico ON citas(medico_id, fecha);
CREATE INDEX idx_citas_paciente ON citas(paciente_id, fecha);

-- ============================================================
-- 5. SEMILLAS DE DATOS INICIALES
-- ============================================================
INSERT INTO roles (id_rol, nombre_rol, descripcion) VALUES
(1, 'admin', 'Administrador del sistema'),
(2, 'medico', 'Médico especialista del sistema'),
(3, 'recepcionista', 'Recepcionista de la clínica'),
(4, 'paciente', 'Paciente del sistema')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

INSERT INTO especialidades (id_especialidad, nombre_especialidad, descripcion) VALUES
(1, 'Medicina General', 'Atención primaria de salud y diagnóstico general.'),
(2, 'Cirugía General', 'Procedimientos quirúrgicos y tratamientos invasivos.'),
(3, 'Pediatría', 'Atención médica infantil y del adolescente.'),
(4, 'Odontología', 'Salud bucal y tratamiento dental.')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Usuarios semilla compatibles con los JSON de pruebas
INSERT INTO usuarios (id, identificacion, nombre, correo, password_hash, telefono, tipo, estado, tipo_identificacion, fecha_nacimiento, regimen, genero, ciudad, especialidad_id, id_rol) VALUES
(1, '1000000001', 'Ana María Gómez', 'ana.paciente@sarc.com', SHA2('Paciente123!', 256), '3004445566', 'PACIENTE', 'ACTIVO', 'CEDULA_CIUDADANIA', '1995-04-12', 'CONTRIBUTIVO', 'FEMENINO', 'Bogotá', NULL, 4),
(2, '1012456781', 'Dr. Alejandro Torres', 'alejandro.medico@sarc.com', SHA2('Medico123!', 256), '3002223344', 'MEDICO', 'ACTIVO', 'CEDULA_CIUDADANIA', '1985-08-20', 'CONTRIBUTIVO', 'MASCULINO', 'Cali', 1, 2),
(3, '1116543809', 'Carlos Andres Medina', 'recepcion@sarc.com', SHA2('Recepcion123!', 256), '3001112233', 'RECEPCIONISTA', 'ACTIVO', 'CEDULA_CIUDADANIA', '1990-01-15', 'CONTRIBUTIVO', 'MASCULINO', 'Cali', NULL, 3)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    correo = VALUES(correo);

-- Cita semilla de prueba
INSERT INTO citas (id, paciente_id, medico_id, recepcionista_id, fecha, hora, motivo, estado, telefono_contacto, correo_contacto) VALUES
(1, 1, 2, 3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', 'Consulta médica general de control', 'PROGRAMADA', '3004445566', 'ana.paciente@sarc.com')
ON DUPLICATE KEY UPDATE motivo = VALUES(motivo);

-- ============================================================
-- VISTA DE CONSULTA RÁPIDA DE CITAS
-- ============================================================
CREATE OR REPLACE VIEW vista_citas_resumen AS
SELECT 
    c.id AS id_cita,
    c.fecha,
    c.hora,
    c.estado,
    p.nombre AS paciente_nombre,
    p.identificacion AS paciente_cedula,
    m.nombre AS medico_nombre,
    e.nombre_especialidad AS especialidad
FROM citas c
INNER JOIN usuarios p ON c.paciente_id = p.id
INNER JOIN usuarios m ON c.medico_id = m.id
LEFT JOIN especialidades e ON m.especialidad_id = e.id_especialidad;