# SARC Backend

Backend del proyecto SARC (Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas), desarrollado con Java 17 y Spring Boot 3.3.5.

Este módulo implementa la API REST, la lógica de negocio, la autenticación de usuarios, el control de acceso y la persistencia de información mediante MySQL.

## Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Java 17 | Lenguaje de programación del backend. |
| Spring Boot 3.3.5 | Framework principal para el desarrollo del servidor. |
| Spring Web | Construcción de endpoints REST. |
| Spring Data JPA | Persistencia y acceso a datos. |
| Hibernate | Mapeo objeto-relacional y administración de entidades. |
| Spring Security | Autenticación y control de acceso. |
| JWT | Gestión de tokens de autenticación. |
| MySQL | Sistema de gestión de bases de datos. |
| Maven | Gestión de dependencias, compilación y ejecución. |
| JUnit y Mockito | Herramientas para pruebas automatizadas. |
| H2 | Base de datos en memoria utilizada en pruebas. |

## Arquitectura del backend

El backend utiliza una arquitectura por capas que separa las responsabilidades de la aplicación.

```text
                 FRONTEND REACT
                       |
                       | HTTP / REST
                       v
                 API REST
                       |
                       v
                CONTROLLERS
                   (web)
                       |
                       v
                 SERVICES
               (Lógica de negocio)
                       |
                       v
                REPOSITORIES
                (Acceso a datos)
                       |
                       v
                 MODELS / JPA
                       |
                       v
                    MYSQL
```

### Organización de paquetes

| Paquete | Responsabilidad |
|---|---|
| `web/` | Controladores y endpoints de la API REST. |
| `service/` | Implementación de la lógica de negocio. |
| `repo/` | Repositorios para consultas y operaciones de persistencia. |
| `model/` | Entidades y modelos del sistema. |
| `dto/` | Objetos de transferencia de datos para solicitudes y respuestas. |
| `security/` | Autenticación, validación de tokens JWT y contexto de usuario. |
| `config/` | Configuración de seguridad, persistencia y otros componentes. |

## Conexión y persistencia de datos

El backend utiliza un servidor MySQL y dos esquemas de base de datos:

| Esquema | Información |
|---|---|
| `proyecto_sarc_api` | Usuarios de personal, especialidades, citas e información relacionada con la atención médica. |
| `sarc_pacientes` | Cuentas y datos de pacientes. |

### Script de inicialización

El script SQL del proyecto se encuentra en:

```text
Data_Base/SARC_Registro.sql
```

Este archivo crea los esquemas requeridos por el sistema y la tabla inicial de pacientes.

Para inicializar la base de datos:

1. Iniciar el servidor MySQL.
2. Abrir MySQL Workbench.
3. Abrir el archivo `Data_Base/SARC_Registro.sql`.
4. Ejecutar el script.
5. Verificar la creación de los esquemas `proyecto_sarc_api` y `sarc_pacientes`.

El usuario MySQL utilizado por el backend debe disponer de permisos suficientes para crear y actualizar las tablas requeridas en ambos esquemas.

El archivo `src/main/resources/schema.sql` asegura la existencia del esquema `sarc_pacientes`. Hibernate administra la creación y actualización de las tablas de las entidades mediante la configuración `ddl-auto: update`.

**Importante:** el archivo SQL es un script de inicialización y no representa una base de datos en ejecución. Se requiere un servidor MySQL disponible para la persistencia de información.

## Requisitos previos

Para ejecutar el backend se requiere:

| Herramienta | Requisito |
|---|---|
| Java JDK | Versión 17 o superior. |
| Apache Maven | Instalado y disponible en la terminal. |
| MySQL Server | Instalado y en ejecución. |
| MySQL Workbench | Recomendado para administrar la base de datos. |

## Configuración del entorno

El archivo `.env.example` contiene una plantilla con las variables de entorno utilizadas por el backend.

Este archivo sirve como referencia de configuración. Spring Boot utiliza las variables definidas en el entorno de ejecución; el archivo `.env.example` no se carga automáticamente.

No deben almacenarse credenciales reales ni claves de servicios externos en el repositorio.

### Variables de conexión a MySQL

| Variable | Descripción |
|---|---|
| `DB_URL` | URL de conexión al esquema principal de MySQL. |
| `DB_USERNAME` | Usuario de conexión a MySQL. |
| `DB_PASSWORD` | Contraseña del usuario de MySQL. |

Valor de referencia:

```text
DB_URL=jdbc:mysql://localhost:3306/proyecto_sarc_api?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
```

### Variables de autenticación

| Variable | Descripción |
|---|---|
| `JWT_SECRET` | Clave utilizada para firmar los tokens JWT. Es obligatoria y debe tener al menos 32 bytes. |
| `ADMIN_PASSWORD` | Clave administrativa requerida para habilitar la creación de cuentas de personal. |

### Variables de configuración CORS

| Variable | Descripción |
|---|---|
| `CORS_ALLOWED_ORIGINS` | Lista de orígenes frontend autorizados para realizar solicitudes al backend, separados por comas. |

Por defecto se permiten los siguientes orígenes locales:

```text
http://localhost:5173
http://127.0.0.1:5173
http://localhost:4173
```

### Variables para correo electrónico

El envío de recordatorios por correo requiere configurar:

| Variable | Descripción |
|---|---|
| `SMTP_HOST` | Servidor SMTP. |
| `SMTP_PORT` | Puerto SMTP. |
| `SMTP_USERNAME` | Usuario del servicio de correo. |
| `SMTP_PASSWORD` | Contraseña del servicio de correo. |
| `SMTP_AUTH` | Habilita la autenticación SMTP. |
| `SMTP_STARTTLS` | Configura el uso de STARTTLS. |
| `MAIL_FROM` | Dirección de correo remitente. |

### Variables para SMS y WhatsApp

El envío mediante Twilio requiere:

| Variable | Descripción |
|---|---|
| `TWILIO_ACCOUNT_SID` | Identificador de la cuenta Twilio. |
| `TWILIO_AUTH_TOKEN` | Token de autenticación de Twilio. |
| `TWILIO_SMS_FROM` | Número remitente para SMS. |
| `TWILIO_WHATSAPP_FROM` | Remitente configurado para WhatsApp. |

Las variables de SMTP y Twilio son opcionales para el funcionamiento general del backend. Se requieren cuando se utilizan los respectivos canales de recordatorio.

## Instalación y ejecución

### 1. Obtener el código fuente

Desde una terminal, clonar el repositorio:

```bash
git clone https://github.com/javierpinzon975-lgtm/SARC.git
```

Ingresar a la carpeta del proyecto:

```bash
cd SARC
```

### 2. Inicializar MySQL

Ejecutar el archivo:

```text
Data_Base/SARC_Registro.sql
```

Verificar que los esquemas estén disponibles antes de iniciar el backend.

### 3. Ingresar al backend

```bash
cd SARC_Backend
```

### 4. Configurar las variables de entorno

En Windows PowerShell, definir las variables principales:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/proyecto_sarc_api?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "CLAVE_DE_MYSQL"
```

Generar una clave para JWT:

```powershell
$bytes = New-Object byte[] 48
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
```

Configurar la clave administrativa:

```powershell
$env:ADMIN_PASSWORD = "CLAVE_ADMINISTRATIVA"
```

Las variables de entorno permanecen disponibles en la terminal actual. Si se cierra la terminal, deberán configurarse nuevamente en la próxima ejecución.

### 5. Ejecutar el backend

Desde la carpeta `SARC_Backend`, ejecutar:

```bash
mvn spring-boot:run
```

El servidor se inicia por defecto en:

```text
http://localhost:8080
```

La API REST está disponible bajo la ruta:

```text
http://localhost:8080/api
```

## Conexión con el frontend

El frontend desarrollado con React y Vite consume los servicios del backend mediante solicitudes HTTP a la API REST.

La dirección predeterminada es:

```text
http://localhost:8080/api
```

Para configurar el frontend, ingresar a:

```text
SARC_Frontend/sarc-react
```

Crear el archivo local `.env.local` a partir de la plantilla `.env.example`:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**Linux / macOS:**

```bash
cp .env.example .env.local
```

La variable utilizada es:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Si se modifica esta dirección, reiniciar el servidor de Vite para aplicar los cambios.

Para ejecutar el frontend:

```bash
npm install
npm run dev
```

La aplicación estará disponible por defecto en:

```text
http://localhost:5173
```

**Orden de ejecución del sistema:**

1. Iniciar MySQL.
2. Ejecutar el backend Spring Boot.
3. Ejecutar el frontend React con Vite.
4. Abrir la aplicación desde el navegador.

## API REST y permisos de acceso

Los endpoints del backend se encuentran agrupados bajo `/api`.

### Endpoints públicos

| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/usuarios` | Registro de pacientes. |
| POST | `/api/usuarios/login` | Autenticación de usuarios. |
| POST | `/api/usuarios/personal` | Creación de cuentas de personal, protegida mediante la clave administrativa `X-Admin-Password`. |
| GET | `/api/usuarios/medicos` | Consulta de médicos disponibles. |
| GET | `/api/especialidades` | Consulta de especialidades. |

### Operaciones por rol

| Rol | Operaciones permitidas |
|---|---|
| **Paciente** | Consultar sus propias citas e información clínica y agendar citas para su propia cuenta. |
| **Médico** | Consultar sus citas y registros médicos, y guardar el parte médico de una cita asignada a él. |
| **Recepcionista** | Consultar usuarios y agenda general, cancelar citas y enviar recordatorios. |

### Endpoints protegidos principales

| Método | Endpoint | Permiso |
|---|---|---|
| GET | `/api/usuarios` | Recepcionista. |
| GET | `/api/citas` | Paciente, médico y recepcionista. |
| POST | `/api/citas` | Paciente. |
| PUT | `/api/citas/{id}/cancelar` | Recepcionista. |
| POST | `/api/citas/{id}/recordatorios` | Recepcionista. |
| GET | `/api/partes-medicos` | Paciente, médico y recepcionista, con resultados filtrados según el rol. |
| PUT | `/api/partes-medicos/{id}` | Médico. |

### Autenticación

El inicio de sesión devuelve un token JWT de tipo Bearer con una vigencia de 12 horas.

El frontend adjunta este token en las solicitudes que requieren autenticación.

El token se mantiene en memoria durante la sesión del navegador. Al recargar la página, el usuario debe iniciar sesión nuevamente.

La creación de cuentas de personal requiere la clave administrativa configurada en `ADMIN_PASSWORD`, enviada mediante el encabezado `X-Admin-Password`. Cada cuenta de personal utiliza su propia contraseña.

## Servicio de recordatorios

El backend permite enviar recordatorios manuales para citas programadas mediante tres canales:

| Canal | Servicio utilizado | Configuración |
|---|---|---|
| Correo | SMTP | Variables `SMTP_*` y `MAIL_FROM`. |
| SMS | Twilio | Variables `TWILIO_*`. |
| WhatsApp | Twilio | Variables `TWILIO_*`. |

Las citas deben encontrarse programadas y tener una fecha futura.

Para el envío por SMS y WhatsApp, el número de teléfono debe estar en formato internacional E.164, por ejemplo:

```text
+573001234567
```

El sistema aplica un intervalo mínimo de un minuto antes de permitir reenviar un recordatorio para la misma cita y canal.

## Pruebas automatizadas

El backend incorpora pruebas automatizadas desarrolladas con JUnit, Mockito y Spring Boot Test.

Las pruebas utilizan H2 en memoria para los escenarios configurados, por lo que no requieren una conexión a MySQL.

Para ejecutar todas las pruebas, desde `SARC_Backend` ejecutar:

```bash
mvn test
```

El proyecto incluye las siguientes clases de prueba:

| Clase | Aspecto evaluado |
|---|---|
| `CitaServiceTest` | Validaciones de agendamiento y control de horarios de citas. |
| `DatabaseMigrationTest` | Migración de pacientes y conservación de identificadores. |
| `RecordatorioServiceTest` | Validación y envío de recordatorios. |
| `SecurityIntegrationTest` | Autenticación, permisos, respuestas de seguridad y configuración CORS. |
| `UsuarioPersistenceTest` | Persistencia de usuarios, autenticación y creación de cuentas de personal. |

El resultado de la ejecución se presenta en la terminal y permite verificar el estado de las pruebas automatizadas.

## Manejo de respuestas y errores

La API utiliza códigos HTTP para comunicar el resultado de las operaciones:

| Código HTTP | Descripción |
|---|---|
| 200 | Solicitud procesada correctamente. |
| 201 | Recurso creado correctamente, cuando aplica. |
| 400 | Error de validación o solicitud incorrecta. |
| 401 | Sesión ausente, inválida o no autorizada. |
| 403 | El usuario autenticado no tiene permisos para realizar la operación. |
| 404 | Recurso solicitado no encontrado. |

Los errores se gestionan mediante los mecanismos de manejo de excepciones del backend y se devuelven como respuestas de la API.

## Repositorio y control de versiones

El código fuente del proyecto se encuentra alojado en GitHub:

**Repositorio:**

https://github.com/javierpinzon975-lgtm/SARC

**Rama principal:** `main`

El repositorio contiene el frontend, el backend, los scripts de inicialización de la base de datos, los archivos de configuración de referencia y las pruebas automatizadas.

## Consideraciones de ejecución

- El backend requiere Java 17 o superior.
- MySQL debe estar disponible antes de iniciar el sistema.
- La conexión a la base de datos se configura mediante variables de entorno.
- `JWT_SECRET` es obligatorio para iniciar el backend.
- El frontend debe apuntar a la dirección correcta de la API REST.
- Los servicios de correo y Twilio requieren credenciales válidas para realizar envíos reales.
- Las credenciales y claves de acceso no deben publicarse en el repositorio.
- Los tokens JWT tienen una vigencia de 12 horas y no se revocan en el servidor antes de su expiración.

---

**SARC — Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas**
