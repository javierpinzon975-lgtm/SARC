# SARC Backend
Backend Spring Boot 3.3 / Java 17 para usuarios, especialidades, citas y HCE.

## Ejecución
Requiere Java 17, Maven y MySQL. Configure `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`
si la instancia no usa los valores por defecto. El backend crea/actualiza el esquema
`proyecto_sarc_api`; `../Data_Base/Data_Base.sql` pertenece al esquema anterior y no
debe importarse en esa base.

```bash
mvn spring-boot:run
```

Al iniciar, el backend agrega las especialidades, los médicos de demostración y la
cuenta de recepción si aún no existen. `mvn test` usa H2 en memoria
(`application-test.yml`).

## API
`POST /api/usuarios`, `POST /api/usuarios/login`, `GET /api/usuarios`,
`GET /api/especialidades`, `POST /api/citas`, `PUT /api/citas/{id}/cancelar`,
`GET /api/citas`, `PUT /api/partes-medicos/{citaId}` y `GET /api/partes-medicos`.
Las fechas y horas usan ISO-8601. Los roles son `PACIENTE`, `MEDICO`, `RECEPCIONISTA`.

El inicio de sesión actual usa nombre e identificación, sin tokens ni contraseñas;
esta API es de demostración y necesita autenticación/autorización antes de exponer
datos clínicos en producción. El envío de SMS/correo tampoco está configurado.
