-- ============================================================
-- BASE DE DATOS: Proyecto SARC (Sistema de Atención y Registro Clínico)
-- ============================================================
-- Fecha de creación: 2026-07-13
-- Descripción: Base de datos para gestión de médicos y recepcionistas
-- ============================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS proyecto_sarc
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE proyecto_sarc;

-- ============================================================
-- TABLA: Especialidades
-- ============================================================
CREATE TABLE IF NOT EXISTS especialidades (
    id_especialidad     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(100) NOT NULL UNIQUE,
    descripcion         TEXT,
    fecha_creacion      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: Médicos
-- ============================================================
CREATE TABLE IF NOT EXISTS medicos (
    id_medico           INT AUTO_INCREMENT PRIMARY KEY,
    cedula_ciudadania   VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo     VARCHAR(200) NOT NULL,
    id_especialidad     INT NOT NULL,
    telefono            VARCHAR(20),
    correo_electronico  VARCHAR(150),
    estado              ENUM('Activo', 'Inactivo', 'Vacaciones') DEFAULT 'Activo',
    fecha_registro      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: Recepcionistas
-- ============================================================
CREATE TABLE IF NOT EXISTS recepcionistas (
    id_recepcionista    INT AUTO_INCREMENT PRIMARY KEY,
    cedula_ciudadania   VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo     VARCHAR(200) NOT NULL,
    telefono            VARCHAR(20),
    correo_electronico  VARCHAR(150),
    turno               ENUM('Mañana', 'Tarde', 'Noche', 'Rotativo') DEFAULT 'Rotativo',
    estado              ENUM('Activo', 'Inactivo', 'Vacaciones') DEFAULT 'Activo',
    fecha_registro      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: Pacientes (estructura base para futuro desarrollo)
-- ============================================================
CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente         INT AUTO_INCREMENT PRIMARY KEY,
    cedula_ciudadania   VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo     VARCHAR(200) NOT NULL,
    fecha_nacimiento    DATE,
    genero              ENUM('Masculino', 'Femenino', 'Otro', 'Prefiere no decir'),
    telefono            VARCHAR(20),
    correo_electronico  VARCHAR(150),
    direccion           VARCHAR(255),
    ciudad              VARCHAR(100),
    fecha_registro      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: Citas Médicas (estructura base para futuro desarrollo)
-- ============================================================
CREATE TABLE IF NOT EXISTS citas (
    id_cita             INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente         INT NOT NULL,
    id_medico           INT NOT NULL,
    id_recepcionista    INT,
    fecha_cita          DATE NOT NULL,
    hora_cita           TIME NOT NULL,
    motivo_consulta     TEXT,
    estado_cita         ENUM('Programada', 'Completada', 'Cancelada', 'NoShow') DEFAULT 'Programada',
    observaciones       TEXT,
    fecha_creacion      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_recepcionista) REFERENCES recepcionistas(id_recepcionista)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INSERCIÓN DE DATOS: Especialidades
-- ============================================================
INSERT INTO especialidades (nombre_especialidad, descripcion) VALUES
('Médico General', 'Atención primaria de salud, diagnóstico general y referencias a especialistas.'),
('Cirujano', 'Especialista en procedimientos quirúrgicos y tratamientos invasivos.'),
('Pediatra', 'Especialista en salud infantil, neonatal y del adolescente.'),
('Odontólogo', 'Especialista en salud bucal, dental y maxilofacial.'),
('Neurocirujano', 'Especialista en cirugía del sistema nervioso central y periférico.');

-- ============================================================
-- INSERCIÓN DE DATOS: Médicos
-- ============================================================
INSERT INTO medicos (cedula_ciudadania, nombre_completo, id_especialidad) VALUES
-- Médicos Generales
('1012456781', 'Alejandro Torres Rojas', 1),
('1009876542', 'Carolina Méndez Ruiz', 1),
('1034567890', 'Julián Herrera Castro', 1),
-- Cirujanos
('1023456712', 'Andrés Salazar Gómez', 2),
('1018765439', 'Natalia Pardo León', 2),
('1045678913', 'Felipe Cárdenas Ríos', 2),
-- Pediatras
('1004567821', 'Laura Sánchez Molina', 3),
('1021987654', 'Sebastián Ortiz Vargas', 3),
('1038765412', 'Diana Ramírez Silva', 3),
-- Odontólogos
('1013345678', 'Camilo Gutiérrez Pérez', 4),
('1025567891', 'Valentina Moreno Díaz', 4),
('1041123456', 'Nicolás Acosta Beltrán', 4),
-- Neurocirujanos
('1009988776', 'Ricardo Fernández Muñoz', 5),
('1022233445', 'Marcela Jiménez Castillo', 5),
('1034455667', 'Esteban Lozano Quintero', 5);

-- ============================================================
-- INSERCIÓN DE DATOS: Recepcionistas
-- ============================================================
INSERT INTO recepcionistas (cedula_ciudadania, nombre_completo) VALUES
('1116543809', 'Carlos Andres Medina'),
('1100299345', 'Laura Camila Duran'),
('1002294056', 'Jorge Darío Pinilla');

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista: Listado completo de médicos con especialidad
CREATE OR REPLACE VIEW vista_medicos_completo AS
SELECT 
    m.id_medico,
    m.cedula_ciudadania AS cedula,
    m.nombre_completo AS nombre,
    e.nombre_especialidad AS especialidad,
    m.estado,
    m.fecha_registro
FROM medicos m
INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
ORDER BY e.nombre_especialidad, m.nombre_completo;

-- Vista: Conteo de médicos por especialidad
CREATE OR REPLACE VIEW vista_conteo_medicos_especialidad AS
SELECT 
    e.nombre_especialidad AS especialidad,
    COUNT(m.id_medico) AS total_medicos
FROM especialidades e
LEFT JOIN medicos m ON e.id_especialidad = m.id_especialidad
GROUP BY e.id_especialidad, e.nombre_especialidad
ORDER BY total_medicos DESC;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
