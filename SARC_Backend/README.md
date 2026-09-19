# SARC Backend
Backend Spring Boot 3.3 / Java 17 para usuarios, especialidades, citas y HCE.

## Ejecución
Configure MySQL `proyecto_sarc` en `application.yml` y ejecute `mvn spring-boot:run`.
`mvn test` usa H2 en memoria (`application-test.yml`).

## API
`POST /api/usuarios`, `POST /api/usuarios/login`, `GET /api/usuarios`; `POST /api/citas`, `PUT /api/citas/{id}/cancelar`, `GET /api/citas`; `PUT /api/partes-medicos/{citaId}`.
Las fechas usan ISO-8601. Los roles son `PACIENTE`, `MEDICO`, `RECEPCIONISTA`.
