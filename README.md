# SARC — Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas

**SARC** es una aplicación web para gestionar citas médicas, consultar agendas y administrar información relacionada con la atención de pacientes. Está desarrollada con React, Java, Spring Boot y MySQL, mediante una arquitectura cliente-servidor con comunicación a través de una API REST.

<p align="center">
  <img src="SARC_Frontend/sarc-react/public/img/Logo_Sistema.png" alt="Logo SARC" width="180">
</p>

![Java](https://img.shields.io/badge/Java-17%2B-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)
![Maven](https://img.shields.io/badge/Maven-Build-red?logo=apachemaven)
![Git](https://img.shields.io/badge/Git-Version%20Control-F05032?logo=git)

---

## Tabla de contenido

- [Descripción general](#descripción-general)
- [Objetivos](#objetivos)
- [Funcionalidades principales](#funcionalidades-principales)
- [Roles del sistema](#roles-del-sistema)
- [Arquitectura](#arquitectura)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Base de datos](#base-de-datos)
- [Requisitos previos](#requisitos-previos)
- [Configuración y ejecución](#configuración-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Pruebas del proyecto](#pruebas-del-proyecto)
- [Control de versiones](#control-de-versiones)
- [Consideraciones de funcionamiento](#consideraciones-de-funcionamiento)

---

## Descripción general

SARC (Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas) es un sistema web diseñado para apoyar la gestión de citas médicas mediante una plataforma centralizada.

La aplicación permite registrar usuarios, autenticar perfiles según su rol, gestionar citas, consultar agendas y registrar información relacionada con la atención médica.

El sistema está organizado en módulos que separan la interfaz de usuario, la lógica de negocio, los servicios de comunicación y la persistencia de información.

### Problema que busca solucionar

La gestión manual de citas médicas puede generar dificultades relacionadas con la disponibilidad de horarios, la organización de agendas, el seguimiento de citas programadas y la consulta de información de los pacientes.

SARC busca centralizar estos procesos y facilitar la interacción entre pacientes, médicos y personal de recepción.

## Objetivos

### Objetivo general

Desarrollar un sistema web para gestionar el agendamiento, consulta, cancelación y seguimiento de citas médicas, facilitando la administración de la información para pacientes, médicos y personal de recepción.

### Objetivos específicos

- Permitir el registro y autenticación de usuarios.
- Gestionar el acceso de acuerdo con los roles del sistema.
- Permitir el agendamiento y consulta de citas médicas.
- Consultar médicos, especialidades y disponibilidad de horarios.
- Permitir la gestión administrativa de las citas.
- Registrar información relacionada con la atención médica.
- Almacenar la información en una base de datos relacional.
- Implementar una API REST para la comunicación entre el frontend y el backend.
- Proporcionar una interfaz web organizada y adaptable.

## Funcionalidades principales

### Gestión de usuarios

- Registro de pacientes.
- Inicio de sesión.
- Validación de credenciales.
- Identificación del rol del usuario.
- Consulta de información según los permisos correspondientes.

### Gestión de citas

- Consulta de médicos y especialidades.
- Selección de fecha y hora.
- Agendamiento de citas.
- Consulta de citas registradas.
- Validación de fechas y horarios.
- Control de disponibilidad del médico.
- Cancelación administrativa de citas.

### Gestión médica e historia clínica electrónica

- Consulta de agenda médica.
- Consulta de citas asignadas al profesional.
- Registro de información de atención médica.
- Registro de diagnóstico, evolución y medicamentos.
- Consulta de información clínica asociada a las atenciones registradas.
- Generación de documentos PDF.

### Recordatorios

El sistema incorpora el envío manual de recordatorios de citas mediante los siguientes canales:

- Correo electrónico, mediante SMTP.
- SMS, mediante Twilio.
- WhatsApp, mediante Twilio.

El funcionamiento de estos servicios externos requiere configurar las credenciales correspondientes en el backend.

### Generación de documentos

El frontend utiliza las siguientes librerías:

| Librería | Función |
|---|---|
| `jsPDF` | Generación de documentos PDF. |
| `jspdf-autotable` | Construcción de tablas dentro de documentos PDF. |

## Roles del sistema

SARC contempla tres perfiles principales:

| Rol | Funciones principales |
|---|---|
| **Paciente** | Registrar una cuenta, iniciar sesión, consultar médicos y especialidades, agendar citas y consultar sus propias citas e información clínica. |
| **Médico** | Consultar su agenda, revisar las citas asignadas y registrar la información médica correspondiente a una atención realizada. |
| **Recepcionista** | Consultar la agenda general, gestionar administrativamente las citas, realizar cancelaciones y enviar recordatorios. |

El acceso a las operaciones se controla mediante autenticación y permisos asociados al rol del usuario.

## Arquitectura

El sistema utiliza una arquitectura cliente-servidor compuesta por una aplicación frontend, una API REST implementada en el backend y una base de datos relacional.

### Arquitectura general

```text
                    USUARIOS
                       |
          +------------+------------+
          |            |            |
       Paciente      Médico    Recepcionista
          |            |            |
          +------------+------------+
                       |
                       v
              FRONTEND WEB
             React + Vite
             JavaScript + CSS
                       |
                       | HTTP / REST
                       v
                API REST
             Spring Boot / Java
                       |
                       v
              LÓGICA DE NEGOCIO
              Services / DTO
                       |
                       v
               PERSISTENCIA
             Spring Data JPA
                       |
                       v
                 MYSQL
              Base de datos
```

### Organización lógica del frontend

El frontend está desarrollado con React y organiza la interfaz y el estado de la aplicación mediante componentes y módulos de apoyo.

- **Components:** componentes visuales y funcionales de la interfaz.
- **Context:** administración del estado global, usuarios, citas e información de sesión.
- **Services:** comunicación con los endpoints del backend.
- **Data:** constantes y datos de apoyo.
- **Utils:** funciones auxiliares y generación de documentos PDF.

El archivo `src/services/api.js` centraliza las solicitudes HTTP realizadas hacia la API REST.

### Organización lógica del backend

El backend está desarrollado con Java y Spring Boot. Su estructura separa responsabilidades en los siguientes paquetes:

- **web:** controladores y endpoints de la API REST.
- **service:** lógica de negocio y procesamiento de operaciones.
- **repo:** acceso y consultas a la persistencia mediante repositorios.
- **model:** entidades y modelos del sistema.
- **dto:** objetos utilizados para transferir información entre capas.
- **security:** autenticación y manejo de tokens.
- **config:** configuración de los componentes del backend.

La comunicación con la base de datos se realiza mediante Spring Data JPA y el conector de MySQL.

## Tecnologías utilizadas

### Frontend

| Tecnología | Uso |
|---|---|
| React 18 | Desarrollo de la interfaz mediante componentes. |
| Vite 5 | Servidor de desarrollo y herramienta de compilación. |
| JavaScript | Lógica e interacción de la aplicación. |
| CSS | Diseño y presentación de la interfaz. |
| jsPDF | Generación de documentos PDF. |
| jspdf-autotable | Generación de tablas en documentos PDF. |

### Backend

| Tecnología | Uso |
|---|---|
| Java 17 | Lenguaje de programación del servidor. |
| Spring Boot 3.3 | Desarrollo y configuración del backend. |
| Spring Web | Construcción de endpoints REST. |
| Spring Security | Autenticación y control de acceso. |
| Spring Data JPA | Persistencia y acceso a datos. |
| Maven | Gestión de dependencias y ejecución del proyecto. |
| JWT | Autenticación mediante tokens. |

### Base de datos

| Tecnología | Uso |
|---|---|
| MySQL | Sistema de gestión de bases de datos relacional. |
| MySQL Connector/J | Conectividad entre Java y MySQL. |
| Hibernate | Mapeo objeto-relacional y administración de entidades. |

## Estructura del proyecto

La estructura principal del repositorio es la siguiente:

```text
SARC/
│
├── README.md
│
├── Data_Base/
│   └── SARC_Registro.sql
│
├── SARC_Backend/
│   ├── .env.example
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/sarc/backend/
│       │   │   ├── config/
│       │   │   ├── dto/
│       │   │   ├── model/
│       │   │   ├── repo/
│       │   │   ├── security/
│       │   │   ├── service/
│       │   │   └── web/
│       │   │
│       │   └── resources/
│       │       ├── application.yml
│       │       └── schema.sql
│       │
│       └── test/
│           ├── java/com/sarc/backend/
│           └── resources/
│
└── SARC_Frontend/
    └── sarc-react/
        ├── e.env
        ├── .gitignore
        ├── package.json
        ├── vite.config.js
        ├── index.html
        ├── public/
        └── src/
            ├── components/
            ├── context/
            ├── data/
            ├── services/
            │   └── api.js
            └── utils/
                ├── helpers.js
                ├── pdf.js
                └── usePersistentState.js
```

## Base de datos

El sistema utiliza dos esquemas de MySQL:

| Esquema | Información almacenada |
|---|---|
| `proyecto_sarc_api` | Usuarios de personal, especialidades, citas e información relacionada con la atención médica. |
| `sarc_pacientes` | Cuentas y datos de pacientes. |

### Script de inicialización

El archivo SQL de inicialización se encuentra en:

```text
Data_Base/SARC_Registro.sql
```

Este script crea los esquemas necesarios y la tabla inicial de pacientes.

Las demás tablas asociadas a las entidades del backend son administradas mediante la configuración de persistencia de Spring Boot e Hibernate.

Para iniciar el sistema, el usuario de MySQL configurado en el backend debe disponer de los permisos necesarios para crear y actualizar las estructuras requeridas en ambos esquemas.

**Importante:** el archivo `.sql` es un script de inicialización; no corresponde a una base de datos ejecutándose. Es necesario disponer de un servidor MySQL e importar o ejecutar el script antes de iniciar el backend.

## Requisitos previos

Antes de ejecutar el proyecto se requiere:

| Herramienta | Requisito |
|---|---|
| Java JDK | Versión 17 o superior. |
| Apache Maven | Instalado y disponible en la terminal. |
| MySQL Server | Servicio de base de datos instalado y en ejecución. |
| MySQL Workbench | Recomendado para importar y administrar el script SQL. |
| Node.js | Versión 18 o superior. |
| npm | Incluido con Node.js. |
| Git | Para clonar y administrar el repositorio. |

## Configuración y ejecución

El proyecto se ejecuta mediante dos procesos independientes: el backend Spring Boot y el frontend React con Vite.

### 1. Obtener el código fuente

Clonar el repositorio:

```bash
git clone https://github.com/javierpinzon975-lgtm/SARC.git
```

Ingresar a la carpeta del proyecto:

```bash
cd SARC
```

### 2. Inicializar la base de datos

1. Abrir MySQL Workbench y conectarse al servidor MySQL.
2. Abrir el archivo `Data_Base/SARC_Registro.sql`.
3. Ejecutar el script.
4. Verificar que se hayan creado los esquemas `proyecto_sarc_api` y `sarc_pacientes`.

El usuario configurado para la conexión del backend debe tener permisos suficientes sobre ambos esquemas.

### 3. Configurar y ejecutar el backend

Ingresar a la carpeta:

```bash
cd SARC_Backend
```

El backend utiliza variables de entorno para configurar la conexión a MySQL, la autenticación y los servicios externos.

En Windows PowerShell, se pueden definir las variables principales de la siguiente manera:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/proyecto_sarc_api?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "CLAVE_DE_MYSQL"
```

Generar una clave para la firma de los tokens JWT:

```powershell
$bytes = New-Object byte[] 48
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
```

Para habilitar la creación de cuentas de personal mediante el mecanismo administrativo del sistema, definir también:

```powershell
$env:ADMIN_PASSWORD = "CLAVE_ADMINISTRATIVA"
```

El repositorio incluye `SARC_Backend/.env.example` como referencia de las variables disponibles. Las variables deben estar definidas en el entorno de ejecución del backend; el archivo de ejemplo no contiene credenciales reales.

Una vez configuradas las variables, ejecutar:

```bash
mvn spring-boot:run
```

El backend se inicia por defecto en:

```text
http://localhost:8080
```

La API REST se encuentra bajo la ruta:

```text
http://localhost:8080/api
```

### 4. Configurar y ejecutar el frontend

Abrir una segunda terminal e ingresar a:

```bash
cd SARC_Frontend/sarc-react
```

El repositorio incluye el archivo `e.env` como referencia para la dirección de la API:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

En Windows PowerShell, crear el archivo local que Vite reconoce:

```powershell
Copy-Item e.env .env.local
```

El archivo `.env.local` permite configurar la dirección del backend y está contemplado en las reglas de exclusión del `.gitignore`.

Instalar las dependencias:

```bash
npm install
```

Ejecutar el frontend:

```bash
npm run dev
```

Vite inicia el servidor de desarrollo en:

```text
http://localhost:5173
```

Abrir esa dirección en el navegador para acceder a SARC.

**Orden de ejecución:** primero debe estar disponible MySQL, después debe iniciarse el backend y finalmente el frontend.

### 5. Compilar el frontend

Para generar la versión de producción del frontend:

```bash
npm run build
```

Los archivos compilados se generan en la carpeta:

```text
dist/
```

Para previsualizar la compilación localmente:

```bash
npm run preview
```

## Variables de entorno

Las variables utilizadas por el backend se definen en el entorno de ejecución.

| Variable | Descripción |
|---|---|
| `DB_URL` | URL de conexión al esquema principal de MySQL. |
| `DB_USERNAME` | Usuario de conexión a MySQL. |
| `DB_PASSWORD` | Contraseña del usuario de MySQL. |
| `JWT_SECRET` | Clave utilizada para firmar los tokens de autenticación. Es obligatoria y debe tener al menos 32 bytes. |
| `ADMIN_PASSWORD` | Clave administrativa utilizada para habilitar la creación de cuentas de personal. |
| `CORS_ALLOWED_ORIGINS` | Orígenes frontend autorizados para realizar solicitudes al backend. |
| `SMTP_HOST` | Servidor SMTP para el envío de correos. |
| `SMTP_PORT` | Puerto del servidor SMTP. |
| `SMTP_USERNAME` | Usuario del servicio de correo. |
| `SMTP_PASSWORD` | Contraseña del servicio de correo. |
| `MAIL_FROM` | Dirección remitente de los correos. |
| `TWILIO_ACCOUNT_SID` | Identificador de la cuenta de Twilio. |
| `TWILIO_AUTH_TOKEN` | Token de autenticación de Twilio. |
| `TWILIO_SMS_FROM` | Número remitente configurado para SMS. |
| `TWILIO_WHATSAPP_FROM` | Remitente configurado para WhatsApp. |

Las variables SMTP y Twilio son opcionales para el arranque general de la aplicación. Se requieren cuando se desea utilizar los canales correspondientes de recordatorios.

En el frontend se utiliza:

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | Dirección base de la API REST utilizada por el frontend. |

Por defecto, el frontend utiliza `http://localhost:8080/api`.

## Pruebas del proyecto

El backend dispone de pruebas automatizadas con JUnit, Mockito y Spring Boot Test. Las pruebas utilizan H2 en memoria para los escenarios configurados, por lo que la ejecución de `mvn test` no requiere una conexión a MySQL.

Para ejecutar las pruebas:

```bash
cd SARC_Backend
mvn test
```

Las clases de prueba existentes cubren los siguientes aspectos:

| Clase de prueba | Aspecto evaluado |
|---|---|
| `CitaServiceTest` | Validaciones de agendamiento y control de horarios de citas. |
| `DatabaseMigrationTest` | Migración de pacientes y conservación de identificadores. |
| `RecordatorioServiceTest` | Validaciones y procesamiento de recordatorios. |
| `SecurityIntegrationTest` | Autenticación, permisos, respuestas de seguridad y configuración CORS. |
| `UsuarioPersistenceTest` | Persistencia de usuarios, autenticación y creación de cuentas de personal. |

Para verificar la compilación del frontend:

```bash
cd SARC_Frontend/sarc-react
npm run build
```

## Control de versiones

El código fuente del proyecto se encuentra alojado en GitHub:

**Repositorio:**  
https://github.com/javierpinzon975-lgtm/SARC

**Rama principal:** `main`

El repositorio contiene los módulos frontend y backend, los scripts de inicialización de la base de datos, la configuración del proyecto y las pruebas automatizadas.

## Consideraciones de funcionamiento

- El backend utiliza tokens JWT con una vigencia de 12 horas.
- El frontend mantiene el token de sesión en memoria. Al recargar la página, el usuario debe iniciar sesión nuevamente.
- El frontend se comunica con el backend mediante solicitudes HTTP a la API REST.
- La dirección de la API puede configurarse mediante `VITE_API_BASE_URL`.
- Los recordatorios por correo, SMS y WhatsApp requieren credenciales válidas de los servicios externos correspondientes.
- Los archivos de configuración locales con credenciales o datos sensibles no deben publicarse en el repositorio.

---

**SARC — Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas**
