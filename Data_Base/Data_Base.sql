-- ============================================================
-- BASE DE DATOS: Proyecto SARC (Sistema de Atención y Registro Clínico)
-- ============================================================
-- Descripción: Base de datos autenticada para gestión de usuarios,
-- médicos, recepcionistas, pacientes y citas del proyecto SARC.
-- ============================================================

CREATE DATABASE IF NOT EXISTS proyecto_sarc
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE proyecto_sarc;

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
-- 2. USUARIOS DEL SISTEMA (AUTENTICACIÓN)
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    cedula_ciudadania VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(200) NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    id_rol INT NOT NULL,
    estado ENUM('Activo', 'Inactivo', 'Suspendido') DEFAULT 'Activo',
    ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol)
        REFERENCES roles(id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_usuarios_correo ON usuarios(correo_electronico);
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);

-- ============================================================
-- 3. ESPECIALIDADES MÉDICAS
-- ============================================================
CREATE TABLE IF NOT EXISTS especialidades (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. PACIENTES
-- ============================================================
CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    genero ENUM('Masculino', 'Femenino', 'Otro', 'Prefiere no decir') DEFAULT 'Otro',
    regimen VARCHAR(50),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pacientes_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. MÉDICOS
-- ============================================================
CREATE TABLE IF NOT EXISTS medicos (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    id_especialidad INT NOT NULL,
    licencia_medica VARCHAR(50),
    estado ENUM('Activo', 'Inactivo', 'Vacaciones') DEFAULT 'Activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_medicos_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_medicos_especialidad FOREIGN KEY (id_especialidad)
        REFERENCES especialidades(id_especialidad)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. RECEPCIONISTAS
-- ============================================================
CREATE TABLE IF NOT EXISTS recepcionistas (
    id_recepcionista INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    turno ENUM('Mañana', 'Tarde', 'Noche', 'Rotativo') DEFAULT 'Rotativo',
    estado ENUM('Activo', 'Inactivo', 'Vacaciones') DEFAULT 'Activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_recepcionistas_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. CITAS MÉDICAS
-- ============================================================
CREATE TABLE IF NOT EXISTS citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    id_recepcionista INT NULL,
    fecha_cita DATE NOT NULL,
    hora_cita TIME NOT NULL,
    motivo_consulta TEXT,
    estado_cita ENUM('Programada', 'Confirmada', 'Completada', 'Cancelada', 'NoShow') DEFAULT 'Programada',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_citas_paciente FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_citas_medico FOREIGN KEY (id_medico)
        REFERENCES medicos(id_medico)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_citas_recepcionista FOREIGN KEY (id_recepcionista)
        REFERENCES recepcionistas(id_recepcionista)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_citas_fecha ON citas(fecha_cita, hora_cita);
CREATE INDEX idx_citas_medico ON citas(id_medico, fecha_cita);
CREATE INDEX idx_citas_paciente ON citas(id_paciente, fecha_cita);

-- ============================================================
-- 8. HISTORIALES CLÍNICOS (OPCIONAL, PARA EL FLUJO DEL MEDICO)
-- ============================================================
CREATE TABLE IF NOT EXISTS historiales_clinicos (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_cita INT NOT NULL,
    id_paciente INT NOT NULL,
    id_medico INT NOT NULL,
    motivo_consulta TEXT,
    diagnostico TEXT,
    tratamiento TEXT,
    medicamentos JSON,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historial_cita FOREIGN KEY (id_cita)
        REFERENCES citas(id_cita)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_historial_paciente FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_historial_medico FOREIGN KEY (id_medico)
        REFERENCES medicos(id_medico)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. SEMILLAS: ROLES
-- ============================================================
INSERT INTO roles (nombre_rol, descripcion) VALUES
('admin', 'Administrador del sistema'),
('medico', 'Médico especialista del sistema'),
('recepcionista', 'Recepcionista de la clínica'),
('paciente', 'Paciente del sistema')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- ============================================================
-- 10. SEMILLAS: ESPECIALIDADES
-- ============================================================
INSERT INTO especialidades (nombre_especialidad, descripcion) VALUES
('Medicina General', 'Atención primaria de salud, diagnóstico general y referencias a especialistas.'),
('Cirugía General', 'Especialista en procedimientos quirúrgicos y tratamientos invasivos.'),
('Pediatría', 'Especialista en salud infantil, neonatal y del adolescente.'),
('Odontología', 'Especialista en salud bucal, dental y maxilofacial.'),
('Neurocirugía', 'Especialista en cirugía del sistema nervioso central y periférico.')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- ============================================================
-- 11. USUARIOS DE PRUEBA (AUTENTICACIÓN)
-- ============================================================
-- NOTA: En un backend real se recomienda usar bcrypt/argon2, pero aquí se usan hashes SHA2
-- para mantener la base de datos funcional y verificable desde SQL.

INSERT INTO usuarios (cedula_ciudadania, nombre_completo, correo_electronico, password_hash, telefono, id_rol) VALUES
('1116543809', 'Carlos Andres Medina', 'recepcion@SARC.com', SHA2('Recepcion123!', 256), '3001112233', 3),
('1012456781', 'Alejandro Torres Rojas', 'alejandro.medico@sarc.com', SHA2('Medico123!', 256), '3002223344', 2),
('1009876542', 'Carolina Méndez Ruiz', 'carolina.medico@sarc.com', SHA2('Medico123!', 256), '3003334455', 2),
('1000000001', 'Ana María Gómez', 'ana.paciente@sarc.com', SHA2('Paciente123!', 256), '3004445566', 4),
('1000000002', 'Daniel Restrepo', 'daniel.paciente@sarc.com', SHA2('Paciente123!', 256), '3005556677', 4),
('1000000003', 'Laura Pineda', 'laura.paciente@sarc.com', SHA2('Paciente123!', 256), '3006667788', 4),
('9999999999', 'Administrador SARC', 'admin@sarc.com', SHA2('Admin123!', 256), '3009998877', 1)
ON DUPLICATE KEY UPDATE
    nombre_completo = VALUES(nombre_completo),
    correo_electronico = VALUES(correo_electronico),
    password_hash = VALUES(password_hash),
    telefono = VALUES(telefono),
    id_rol = VALUES(id_rol);

-- ============================================================
-- 12. DETALLES DE PACIENTES
-- ============================================================
INSERT INTO pacientes (id_usuario, fecha_nacimiento, genero, regimen, direccion, ciudad) VALUES
((SELECT id_usuario FROM usuarios WHERE correo_electronico = 'ana.paciente@sarc.com'), '1995-04-12', 'Femenino', 'Contributivo', 'Cra 10 #20-15', 'Bogotá'),
((SELECT id_usuario FROM usuarios WHERE correo_electronico = 'daniel.paciente@sarc.com'), '1988-02-28', 'Masculino', 'Subsidiado', 'Cl 45 #12-30', 'Medellín'),
((SELECT id_usuario FROM usuarios WHERE correo_electronico = 'laura.paciente@sarc.com'), '2001-11-08', 'Femenino', 'Contributivo', 'Av 68 #44-10', 'Cali')
ON DUPLICATE KEY UPDATE
    fecha_nacimiento = VALUES(fecha_nacimiento),
    genero = VALUES(genero),
    regimen = VALUES(regimen),
    direccion = VALUES(direccion),
    ciudad = VALUES(ciudad);

-- ============================================================
-- 13. DETALLES DE MÉDICOS
-- ============================================================
INSERT INTO medicos (id_usuario, id_especialidad, licencia_medica) VALUES
((SELECT id_usuario FROM usuarios WHERE correo_electronico = 'alejandro.medico@sarc.com'), 1, 'MED-1001'),
((SELECT id_usuario FROM usuarios WHERE correo_electronico = 'carolina.medico@sarc.com'), 2, 'MED-2002')
ON DUPLICATE KEY UPDATE
    id_especialidad = VALUES(id_especialidad),
    licencia_medica = VALUES(licencia_medica);

-- ============================================================
-- 14. DETALLES DE RECEPCIONISTAS
-- ============================================================
INSERT INTO recepcionistas (id_usuario, turno, estado) VALUES
((SELECT id_usuario FROM usuarios WHERE correo_electronico = 'recepcion@SARC.com'), 'Mañana', 'Activo')
ON DUPLICATE KEY UPDATE
    turno = VALUES(turno),
    estado = VALUES(estado);

-- ============================================================
-- 15. CITAS DE EJEMPLO
-- ============================================================
INSERT INTO citas (id_paciente, id_medico, id_recepcionista, fecha_cita, hora_cita, motivo_consulta, estado_cita, observaciones) VALUES
(
    (SELECT id_paciente FROM pacientes WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE correo_electronico = 'ana.paciente@sarc.com')),
    (SELECT id_medico FROM medicos WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE correo_electronico = 'alejandro.medico@sarc.com')),
    (SELECT id_recepcionista FROM recepcionistas WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE correo_electronico = 'recepcion@SARC.com')),
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    '09:00:00',
    'Consulta general de control',
    'Programada',
    'Paciente con revisión preventiva.'
),
(
    (SELECT id_paciente FROM pacientes WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE correo_electronico = 'daniel.paciente@sarc.com')),
    (SELECT id_medico FROM medicos WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE correo_electronico = 'carolina.medico@sarc.com')),
    (SELECT id_recepcionista FROM recepcionistas WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE correo_electronico = 'recepcion@SARC.com')),
    DATE_ADD(CURDATE(), INTERVAL 4 DAY),
    '14:30:00',
    'Seguimiento postoperatorio',
    'Confirmada',
    'Paciente requiere control por evolución.'
)
ON DUPLICATE KEY UPDATE
    motivo_consulta = VALUES(motivo_consulta),
    estado_cita = VALUES(estado_cita),
    observaciones = VALUES(observaciones);

-- ============================================================
-- 16. VISTAS ÚTILES PARA LOGIN Y CONSULTA DE USUARIOS
-- ============================================================
CREATE OR REPLACE VIEW vista_usuarios_roles AS
SELECT
    u.id_usuario,
    u.cedula_ciudadania,
    u.nombre_completo,
    u.correo_electronico,
    u.telefono,
    r.nombre_rol,
    u.estado,
    u.fecha_creacion
FROM usuarios u
INNER JOIN roles r ON u.id_rol = r.id_rol;

CREATE OR REPLACE VIEW vista_medicos_completo AS
SELECT
    m.id_medico,
    u.nombre_completo AS nombre,
    u.cedula_ciudadania AS cedula,
    e.nombre_especialidad AS especialidad,
    m.licencia_medica,
    m.estado,
    u.correo_electronico,
    u.telefono
FROM medicos m
INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad;

CREATE OR REPLACE VIEW vista_recepcionistas_completo AS
SELECT
    r.id_recepcionista,
    u.nombre_completo AS nombre,
    u.cedula_ciudadania AS cedula,
    u.correo_electronico,
    u.telefono,
    r.turno,
    r.estado
FROM recepcionistas r
INNER JOIN usuarios u ON r.id_usuario = u.id_usuario;

CREATE OR REPLACE VIEW vista_pacientes_completo AS
SELECT
    p.id_paciente,
    u.nombre_completo AS nombre,
    u.cedula_ciudadania AS cedula,
    u.correo_electronico,
    u.telefono,
    p.fecha_nacimiento,
    p.genero,
    p.regimen,
    p.direccion,
    p.ciudad
FROM pacientes p
INNER JOIN usuarios u ON p.id_usuario = u.id_usuario;

-- ============================================================
-- 17. PROCEDIMIENTO PARA REGISTRAR NUEVOS USUARIOS CON ROL
-- ============================================================
DELIMITER $$
CREATE PROCEDURE sp_registrar_usuario(
    IN p_cedula VARCHAR(20),
    IN p_nombre VARCHAR(200),
    IN p_email VARCHAR(150),
    IN p_password VARCHAR(255),
    IN p_telefono VARCHAR(20),
    IN p_rol VARCHAR(50),
    IN p_regimen VARCHAR(50),
    IN p_fecha_nacimiento DATE,
    IN p_genero VARCHAR(30),
    IN p_direccion VARCHAR(255),
    IN p_ciudad VARCHAR(100),
    IN p_especialidad INT,
    IN p_turno VARCHAR(20),
    IN p_licencia VARCHAR(50)
)
BEGIN
    DECLARE v_rol_id INT;
    DECLARE v_usuario_id INT;

    IF NOT EXISTS (SELECT 1 FROM roles WHERE nombre_rol = p_rol) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El rol indicado no existe.';
    END IF;

    SELECT id_rol INTO v_rol_id FROM roles WHERE nombre_rol = p_rol;

    IF EXISTS (SELECT 1 FROM usuarios WHERE cedula_ciudadania = p_cedula OR correo_electronico = p_email) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ya existe un usuario con la cédula o correo indicado.';
    END IF;

    INSERT INTO usuarios (cedula_ciudadania, nombre_completo, correo_electronico, password_hash, telefono, id_rol)
    VALUES (p_cedula, p_nombre, p_email, SHA2(p_password, 256), p_telefono, v_rol_id);

    SET v_usuario_id = LAST_INSERT_ID();

    IF p_rol = 'paciente' THEN
        INSERT INTO pacientes (id_usuario, fecha_nacimiento, genero, regimen, direccion, ciudad)
        VALUES (v_usuario_id, p_fecha_nacimiento, p_genero, p_regimen, p_direccion, p_ciudad);
    ELSEIF p_rol = 'medico' THEN
        INSERT INTO medicos (id_usuario, id_especialidad, licencia_medica)
        VALUES (v_usuario_id, p_especialidad, p_licencia);
    ELSEIF p_rol = 'recepcionista' THEN
        INSERT INTO recepcionistas (id_usuario, turno, estado)
        VALUES (v_usuario_id, p_turno, 'Activo');
    END IF;
END$$
DELIMITER ;

-- ============================================================
-- 18. VALIDACIÓN DE ACCESO
-- ============================================================
-- Este ejemplo permite buscar un usuario por correo y comparar el hash SHA2.
-- El backend real debe usar bcrypt/argon2 para autenticación segura.

-- Ejemplo de validación:
-- SELECT id_usuario, nombre_completo, id_rol
-- FROM usuarios
-- WHERE correo_electronico = 'admin@sarc.com'
--   AND password_hash = SHA2('Admin123!', 256);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
