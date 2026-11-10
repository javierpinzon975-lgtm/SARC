# SARC Backend

Backend Spring Boot 3.3 / Java 17 para registro de usuarios, agenda, recordatorios e HCE.

## Conexión del sistema

El backend usa un servidor MySQL y dos esquemas:

- `proyecto_sarc_api`: personal, especialidades, citas e historias clínicas.
- `sarc_pacientes`: cuentas y datos de pacientes.

Importe `../Data_Base/SARC_Registro.sql` en MySQL Workbench. El usuario MySQL que use
el backend debe poder crear/actualizar tablas en ambos esquemas. `schema.sql` crea el
esquema de pacientes automáticamente; Hibernate crea y actualiza las tablas de ambas
bases (`ddl-auto: update`).

Copie `.env.example` como referencia y defina las variables en el entorno del backend.
No se deben guardar credenciales reales en el repositorio. En PowerShell, antes de
ejecutar el backend, configure al menos:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "su-clave-de-MySQL"
$bytes = New-Object byte[] 48
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($bytes)
$env:ADMIN_PASSWORD = "una-clave-larga-y-separada"
mvn spring-boot:run
```

`JWT_SECRET` es obligatorio y debe tener al menos 32 bytes. Mantenga el mismo valor
mientras el backend esté en funcionamiento. Al cerrar esa terminal, sus variables de
entorno se pierden; configúrelas de nuevo para otra ejecución.

Para conectar Vite, copie `../SARC_Frontend/sarc-react/.env.example` a
`../SARC_Frontend/sarc-react/.env.local` y ajuste `VITE_API_BASE_URL` si el API no está
en `http://localhost:8080/api`. Vite lee las variables al arrancar, así que reinicie
su servidor después de cambiar `.env.local`. Por defecto, CORS permite `localhost:5173`,
`127.0.0.1:5173` y `localhost:4173`; en despliegues, defina `CORS_ALLOWED_ORIGINS`
como una lista separada por comas con los orígenes frontend autorizados.

## Arranque local

Requiere Java 17+, Maven, MySQL y Node.js/npm.

1. Importe `Data_Base/SARC_Registro.sql` en MySQL.
2. En una terminal, configure las variables anteriores y ejecute `mvn spring-boot:run`
   desde `SARC_Backend`.
3. En otra terminal, ejecute `npm install` una vez y `npm run dev` desde
   `SARC_Frontend/sarc-react`.
4. Abra la dirección local que muestra Vite (por defecto `http://localhost:5173`).

`mvn test` usa H2 en memoria y no requiere MySQL.

## API y permisos

Todas las rutas están bajo `/api`. El inicio de sesión devuelve un JWT Bearer válido
por 12 horas; el frontend lo adjunta a las solicitudes protegidas y lo mantiene en
memoria hasta cerrar sesión o recargar la página.

- Público: `POST /usuarios` (registro de pacientes), `POST /usuarios/login`,
  `POST /usuarios/personal` (protegido por `X-Admin-Password`),
  `GET /usuarios/medicos` y `GET /especialidades`.
- Paciente autenticado: consultar sus propias citas e historia, y agendar únicamente
  para su propia cuenta.
- Médico autenticado: consultar sus citas y partes, y guardar el parte únicamente de
  una cita asignada a ese médico.
- Recepcionista autenticado: consultar agenda, cancelar citas y enviar recordatorios.

Los perfiles de personal de demostración no tienen contraseña: deben habilitarse con
`POST /api/usuarios/personal`, la clave administrativa y una contraseña individual
para cada cuenta. No existe una contraseña única compartida para todos los empleados.

## Recordatorios

El panel de recepción envía recordatorios manuales mediante SMTP (`CORREO`) o Twilio
(`SMS`, `WHATSAPP`). Para correo defina `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`,
`SMTP_PASSWORD` y `MAIL_FROM`. Para Twilio defina `TWILIO_ACCOUNT_SID`,
`TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM` y `TWILIO_WHATSAPP_FROM`, habilitados para su
cuenta y región. Estas credenciales solo se configuran en el backend. Los teléfonos
deben estar en formato internacional E.164, como `+573001234567`. Cada cita y canal
puede reenviarse como máximo una vez por minuto.

## Operación

`GET /api/citas` y `GET /api/partes-medicos` filtran los datos por el rol y el usuario
del token. Las validaciones devuelven 400; las sesiones ausentes o inválidas devuelven
401, y las operaciones fuera del rol permitido devuelven 403.

Use HTTPS, copias de seguridad y credenciales gestionadas por el entorno antes de
exponer el sistema o datos clínicos en producción. Los tokens JWT no se revocan en el
servidor antes de su expiración; cierre de sesión los elimina del navegador.
