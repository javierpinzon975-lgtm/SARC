Sistema de agendamiento, recordatorio y cancelacion de citas medicas (SARC)

SARC; es un sistema una aplicación web desarrollada para EPS P&G, una entidad de salud ficticia utilizada como caso de estudio formativo. El sistema permite gestionar de forma centralizada el ciclo completo de una cita médica: desde el registro del paciente y la solicitud de la cita, hasta la atención clínica y la generación de soportes documentales en PDF.
La aplicación está construida como una interfaz web multirol, en la que un mismo sistema atiende tres tipos de usuario con necesidades distintas: el paciente, quien agenda y consulta sus citas; el personal de recepción, quien administra la agenda global y gestiona notificaciones y cancelaciones; y el médico, quien consulta su agenda diaria y diligencia la Historia Clínica Electrónica (HCE) de cada paciente atendido.
El proyecto nació como un desarrollo en HTML, CSS y JavaScript puro (vanilla), con persistencia de datos en el almacenamiento local del navegador (localStorage), y posteriormente fue migrado a una arquitectura basada en componentes con React, conservando de manera íntegra toda la lógica de negocio, el diseño visual y el comportamiento funcional de la versión original.

2. Tecnologías Utilizadas
El desarrollo del sistema combina tecnologías del lado del cliente (frontend) orientadas a construir una interfaz responsiva, interactiva y con generación de documentos, sin depender de un servidor backend para su funcionamiento actual:

Lenguaje base — JavaScript (ES6+): Lógica de negocio: autenticación por rol, agendamiento, validación de horarios, cancelaciones y manejo del historial clínico.

Interfaz (versión base) — HTML5 + CSS3: Estructura semántica de la interfaz y sistema de diseño visual tipo glassmorphism (tarjetas translúcidas, desenfoque de fondo, paleta pastel).

Librería de interfaz — React 18: Reconstrucción de la interfaz como árbol de componentes reutilizables, con manejo de estado mediante Context API y Hooks (useState, useEffect, useContext).

Entorno de desarrollo — Vite: Servidor de desarrollo con recarga instantánea (Hot Module Replacement) y empaquetado optimizado para producción (npm run build).

Generación de documentos — jsPDF + jsPDF-AutoTable: Generación en el navegador de los PDF del parte médico individual y del historial clínico completo del paciente, incluyendo tablas de medicamentos formulados.

Persistencia de datos — Web Storage API (localStorage): Almacenamiento en el navegador de usuarios registrados, citas agendadas e historiales clínicos, sin necesidad de un servidor de base de datos.

Control de versiones / paquetes — npm: Gestión de dependencias del proyecto (React, jsPDF) y scripts de ejecución (dev, build, preview).

3. Módulos Desarrollados
El sistema se organiza en cinco módulos funcionales, cada uno correspondiente a una necesidad concreta dentro del flujo de agendamiento y atención médica:

1. Autenticación y Registro: Permite el inicio de sesión diferenciado por rol (paciente, médico o recepcionista) a partir de nombre completo y número de identificación, y el autorregistro de pacientes nuevos capturando fecha de nacimiento y tipo de régimen (Contributivo o Subsidiado). Valida credenciales existentes e impide duplicidad de identificación en el registro.

2. Panel del Paciente y Agendamiento de Citas: Permite al paciente solicitar una cita seleccionando especialidad médica, médico asignado, fecha y hora disponible; el sistema filtra dinámicamente los médicos por especialidad y las franjas horarias ya ocupadas. También muestra el listado de citas propias con su estado (Confirmada / Cancelada) y permite descargar el parte médico o el historial clínico completo en PDF.

3. Panel de Recepción: Ofrece una consola global de todas las citas del sistema, con la posibilidad de enviar recordatorios simulados al paciente (vía celular y correo registrados) y de cancelar citas por cambios en la agenda del especialista, generando de forma automática una notificación de cancelación.

4. Panel Médico y Agenda Diaria: Presenta al médico su agenda del día organizada por franjas horarias de 8:00 a.m. a 5:00 p.m., diferenciando visualmente los espacios libres de los ocupados. Al seleccionar una cita ocupada, se habilita el acceso a la Historia Clínica Electrónica del paciente correspondiente.

5. Historia Clínica Electrónica (HCE) y Generación de PDF: Módulo de diligenciamiento del parte médico: diagnóstico, evolución/pronóstico y una tabla dinámica de medicamentos formulados (con filas que se pueden agregar o eliminar). Una vez guardado, el parte queda asociado al historial clínico del paciente y puede exportarse individualmente en PDF o de forma consolidada como historial clínico completo, con encabezado institucional, datos del paciente y del profesional, y tabla de medicamentos.
