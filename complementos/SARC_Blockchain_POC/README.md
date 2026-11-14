# SARC Blockchain Traceability — Prueba de concepto

**Evidencia:** GA8_220501096_AA2_EV04_ITC — Video de prueba de concepto con tecnología emergente o disruptiva.

## 1. Propósito

Demostrar, mediante una simulación local de cadena de bloques, cómo una secuencia de eventos de citas médicas puede enlazarse criptográficamente para detectar alteraciones posteriores en los datos registrados.

## 2. Tecnología utilizada

- JavaScript (módulos ES).
- Web Crypto API (`crypto.subtle.digest`) para calcular hashes SHA-256 en el navegador.
- Node.js 24 o superior para ejecutar el servidor local y las pruebas automatizadas.
- HTML5 y CSS3 para la interfaz.

## 3. Alcance y limitaciones

Este proyecto es una **simulación académica de una cadena de hashes**. Cada bloque contiene datos sintéticos del evento, el hash del bloque anterior y su propio hash SHA-256. La verificación recalcula los hashes y comprueba los enlaces.

No implementa una blockchain distribuida real: no incluye red P2P, consenso, minería, nodos independientes ni persistencia en una base de datos. Tampoco reemplaza el historial transaccional de SARC. La prueba se ejecuta localmente y los datos se pierden al recargar la página.

## 4. Requisitos

- Node.js 22 o superior.
- Navegador moderno compatible con Web Crypto API.

No requiere instalar dependencias externas.

## 5. Ejecución

Desde esta carpeta:

```bash
npm start
```

Abrir en el navegador:

```text
http://127.0.0.1:4173
```

## 6. Demostración sugerida

1. Presionar **Cargar ejemplo** para crear tres eventos ficticios: creación, actualización y cancelación de una cita.
2. Presionar **Verificar integridad** y comprobar que la cadena aparece como válida.
3. En el segundo bloque, presionar **Alterar dato (demostración)**.
4. Volver a verificar y observar que el sistema informa que el contenido del bloque ya no coincide con su hash.
5. Presionar **Restablecer** para volver a una cadena inicial válida.
6. Agregar manualmente un evento y verificar nuevamente.

## 7. Pruebas automatizadas

Ejecutar:

```bash
npm test
```

Las pruebas comprueban: formato del hash SHA-256, validez inicial de la cadena, incorporación y enlace de bloques, detección de alteración de datos, detección de ruptura de enlaces y rechazo de eventos incompletos.

## 8. Relación con SARC

Los tipos de evento de ejemplo representan acciones que existen conceptualmente en un sistema de citas: creación, actualización de estado y cancelación. En una integración futura, los eventos podrían generarse desde los servicios de SARC y persistirse junto con los identificadores de las citas. Esta prueba no consume la API actual ni escribe en sus bases de datos; funciona como componente demostrativo independiente.

## 9. Datos y privacidad

Utilizar exclusivamente datos sintéticos. No introducir nombres reales, números de identificación, datos clínicos, credenciales ni información de pacientes.
