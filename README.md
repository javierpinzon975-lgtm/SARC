# 🏥 SARC — Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas

<p align="center">
  <strong>SARC</strong> es una plataforma web para la gestión integral de citas médicas, desarrollada con React, Spring Boot y una base de datos relacional.
</p>

<p align="center">
  <img src="SARC_Frontend/sarc-react/public/img/Logo_Sistema.png" alt="SARC Logo" width="180">
</p>

<p align="center">

![Java](https://img.shields.io/badge/Java-17%2B-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5%2B-646CFF?style=for-the-badge&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?style=for-the-badge&logo=javascript)
![SQL](https://img.shields.io/badge/SQL-Database-blue?style=for-the-badge&logo=mysql)
![Maven](https://img.shields.io/badge/Maven-Build-red?style=for-the-badge&logo=apachemaven)
![Git](https://img.shields.io/badge/Git-Version%20Control-F05032?style=for-the-badge&logo=git)

</p>

---

# Tabla de contenido

- [Descripción](#-descripción)
- [Objetivos](#-objetivos)
- [Características](#-características-principales)
- [Roles del sistema](#-roles-del-sistema)
- [Arquitectura](#-arquitectura-del-sistema)
- [Tecnologías](#-tecnologías-utilizadas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Base de datos](#️-base-de-datos)
- [Flujo del sistema](#-flujo-general-del-sistema)
- [Pruebas](#-pruebas)
- [Seguridad](#-seguridad)


---

# Descripción

**SARC** (Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas) es un sistema web diseñado para facilitar la gestión de citas médicas mediante una plataforma centralizada.

El sistema permite a los usuarios y administrativos(Recepcionistas y medicos) realizar diferentes operaciones relacionadas con la atención médica, incluyendo el **agendamiento, consulta, recordatorio y cancelación de citas**.

La aplicación está construida utilizando una arquitectura **Frontend + API Backend + Base de Datos**, permitiendo separar la interfaz de usuario, la lógica de negocio y la persistencia de información.


## Problema que busca solucionar

Los procesos tradicionales de gestión de citas pueden generar dificultades relacionadas con:

- Disponibilidad de horarios.
- Organización de agendas.
- Cancelación de citas.
- Consulta de información.
- Seguimiento de citas programadas.
- Comunicación entre pacientes y personal médico.

SARC busca centralizar estos procesos en una única plataforma.

---

# 🎯 Objetivos

## Objetivo general

Desarrollar un sistema web que permita gestionar de manera organizada el **agendamiento, recordatorio y cancelación de citas médicas**, facilitando la administración de la información para pacientes, médicos y personal de recepción.

## Objetivos específicos

- Permitir el registro y autenticación de usuarios.
- Gestionar diferentes roles dentro del sistema.
- Permitir el agendamiento de citas médicas.
- Consultar la disponibilidad de horarios.
- Permitir la consulta y cancelación de citas.
- Administrar información relacionada con pacientes y médicos.
- Implementar una base de datos para almacenar la información.
- Desarrollar una API REST para la comunicación entre frontend y backend.
- Implementar una interfaz web intuitiva y organizada.

---

# Características principales

### 👤 Gestión de usuarios

- Registro de usuarios.
- Inicio de sesión.
- Validación de información.
- Manejo de diferentes roles.
- Gestión de información del usuario.

### 📅 Gestión de citas

- Agendamiento de citas.
- Consulta de citas.
- Selección de fecha y hora.
- Consulta de disponibilidad.
- Cancelación de citas.
- Visualización mediante calendario.

### 👨‍⚕️ Gestión médica

- Gestión de médicos.
- Gestión de especialidades.
- Consulta de información relacionada con la atención.
- Gestión de información médica.

### 🔔 Recordatorios

El sistema contempla funcionalidades relacionadas con el seguimiento y recordatorio de citas programadas.

### 📄 Documentos

El frontend incorpora funcionalidades para generar documentos PDF utilizando:

- `jsPDF`
- `jsPDF-AutoTable`
- `html2canvas`

---

#  Roles del sistema

SARC contempla diferentes perfiles de usuario.

| Rol | Funciones principales |
|---|---|
| 👤 **Paciente** | Registrar cuenta, iniciar sesión, consultar disponibilidad, agendar y cancelar citas |
| 👨‍⚕️ **Médico** | Consultar agenda, visualizar citas y gestionar información relacionada con pacientes |
| 🧑‍💼 **Recepcionista** | Gestionar pacientes, citas y procesos administrativos |

---

# Arquitectura del sistema

El sistema está dividido en tres componentes principales:

```text
┌──────────────────────────────────────────────────┐
│                    USUARIOS                      │
│                                                  │
│       Paciente │ Médico │ Recepcionista         │
└───────────────────────┬──────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────┐
│                    FRONTEND                      │
│                                                  │
│              React + Vite + JavaScript           │
│                      + CSS                       │
└───────────────────────┬──────────────────────────┘
                        │
                        │ HTTP / REST API
                        ▼
┌──────────────────────────────────────────────────┐
│                    BACKEND                       │
│                                                  │
│             Java + Spring Boot                   │
│        Services + Repositories + DTO             │
└───────────────────────┬──────────────────────────┘
                        │
                        │ JPA
                        ▼
┌──────────────────────────────────────────────────┐
│                  BASE DE DATOS                   │
│                                                  │
│                       SQL                        │
└──────────────────────────────────────────────────┘
```

## Arquitectura lógica

```text
Frontend
   │
   ├── Components
   ├── Context
   ├── Utils
   └── Data
          │
          ▼
       REST API
          │
          ▼
Backend
   │
   ├── Controller / Web
   ├── Service
   ├── Repository
   ├── DTO
   └── Model
          │
          ▼
     Base de datos
```

---

# Tecnologías utilizadas

## Frontend

### React

Framework utilizado para construir la interfaz mediante componentes reutilizables.

### Vite

Herramienta utilizada para el desarrollo, compilación y ejecución del frontend.

### JavaScript

Lenguaje utilizado para implementar la lógica e interacción de la aplicación.

### CSS

Utilizado para el diseño visual y estilos de la aplicación.

### Librerías adicionales

| Librería | Función |
|---|---|
| **jsPDF** | Generación de documentos PDF |
| **jsPDF-AutoTable** | Creación de tablas en PDF |
| **html2canvas** | Conversión de elementos HTML a imágenes |
| **DOMPurify** | Sanitización de contenido HTML |

---

## Backend

### Java

Lenguaje utilizado para desarrollar la lógica del servidor.

### Spring Boot

Framework utilizado para construir la API REST y estructurar el backend.

### Spring Data JPA

Utilizado para la interacción entre las entidades Java y la base de datos.

### Maven

Herramienta utilizada para gestionar dependencias, compilación y ejecución del proyecto.

---

## Base de datos

El proyecto utiliza una base de datos relacional mediante un script SQL.

Archivo principal:

```text
Data_Base/Data_Base.sql
```

---

# 📂 Estructura del proyecto

```text
SARC/
│
├── 📁 Data_Base/
│   └── 📄 Data_Base.sql
│
├── 📁 SARC_Backend/
│   │
│   ├── 📄 pom.xml
│   │
│   └── 📁 src/
│       │
│       ├── 📁 main/
│       │   │
│       │   ├── 📁 java/
│       │   │   └── 📁 com/sarc/backend/
│       │   │       │
│       │   │       ├── 📁 dto/
│       │   │       ├── 📁 model/
│       │   │       ├── 📁 repo/
│       │   │       ├── 📁 service/
│       │   │       └── 📁 web/
│       │   │
│       │   └── 📁 resources/
│       │       └── 📄 application.yml
│       │
│       └── 📁 test/
│
└── 📁 SARC_Frontend/
    │
    └── 📁 sarc-react/
        │
        ├── 📁 public/
        │
        ├── 📁 src/
        │   ├── 📁 components/
        │   ├── 📁 context/
        │   ├── 📁 data/
        │   └── 📁 utils/
        │
        ├── 📄 package.json
        ├── 📄 vite.config.js
        └── 📄 index.html
```

---

# Base de datos

El archivo:

```text
Data_Base/Data_Base.sql
```

contiene el script necesario para crear la estructura de la base de datos utilizada por SARC.

La información gestionada incluye:

- Usuarios.
- Pacientes.
- Médicos.
- Especialidades.
- Citas.
- Información médica.
- Estados de las citas.

### ⚠️ Importante

El archivo `.sql` **no es la base de datos ejecutándose**.

Es un **script SQL** que contiene instrucciones para crear tablas, relaciones y/o cargar información en un gestor de bases de datos.

---

# 🔄 Flujo general del sistema

```text
                 INICIO
                    │
                    ▼
          ┌──────────────────┐
          │ Registro / Login │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Identificación   │
          │      del rol     │
          └────────┬─────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   Paciente      Médico   Recepcionista
       │           │           │
       ▼           ▼           ▼
   Gestionar     Consultar   Gestionar
     citas        agenda       citas
       │
       ▼
   Seleccionar
     fecha
       │
       ▼
   Seleccionar
      hora
       │
       ▼
   Confirmar cita
       │
       ▼
   Guardar datos
       │
       ▼
   Recordatorio
       │
       ▼
   Consulta /
   Cancelación
```

---

# 🔐 Seguridad

El sistema contempla diferentes aspectos relacionados con la seguridad de la información:

- Autenticación de usuarios.
- Manejo de roles.
- Validación de datos.
- Control de acceso.
- Separación entre frontend y backend.
- Persistencia mediante repositorios.
- Sanitización de contenido mediante `DOMPurify`.
- Manejo de errores en el backend.

La separación entre frontend, backend y base de datos permite mantener una arquitectura organizada y facilita la implementación de mecanismos adicionales de seguridad.



<p align="center">
  <strong>🏥 SARC — Sistema de Agendamiento, Recordatorio y Cancelacion de de citas médicas</strong>
</p>

