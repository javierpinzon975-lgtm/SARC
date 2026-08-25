Sistema de agendamiento, recordatorio y cancelacion de citas medicas (SARC)

SARC; es un sistema una aplicación web desarrollada para EPS P&G, una entidad de salud ficticia utilizada como caso de estudio formativo. El sistema permite gestionar de forma centralizada el ciclo completo de una cita médica: desde el registro del paciente y la solicitud de la cita, hasta la atención clínica y la generación de soportes documentales en PDF.
La aplicación está construida como una interfaz web multirol, en la que un mismo sistema atiende tres tipos de usuario con necesidades distintas: el paciente, quien agenda y consulta sus citas; el personal de recepción, quien administra la agenda global y gestiona notificaciones y cancelaciones; y el médico, quien consulta su agenda diaria y diligencia la Historia Clínica Electrónica (HCE) de cada paciente atendido.
El proyecto nació como un desarrollo en HTML, CSS y JavaScript puro (vanilla), con persistencia de datos en el almacenamiento local del navegador (localStorage), y posteriormente fue migrado a una arquitectura basada en componentes con React, conservando de manera íntegra toda la lógica de negocio, el diseño visual y el comportamiento funcional de la versión original.


Tecnologías:
- Lenguaje: JavaScript (ES6+)
- Interfaz: HTML5, CSS3 (Glassmorphism), React 18 (Context API, Hooks)
- Herramientas de build: Vite, npm
- Generación de reportes: jsPDF, jsPDF-AutoTable
- Persistencia: Web Storage API (localStorage)

Módulos Implementados:
1. Autenticación y Registro: Manejo multirol (paciente, médico, recepción), validación de credenciales y prevención de duplicados.
2. Panel del Paciente: Agendamiento interactivo con filtrado dinámico de horarios/especialidades y descarga de partes/historial clínico en PDF.
3. Panel de Recepción: Gestión global de agenda, envío de recordatorios simulados y procesamiento de cancelaciones.
4. Panel Médico: Visualización de agenda diaria (8:00 a.m. a 5:00 p.m.) y acceso directo a la Historia Clínica Electrónica (HCE).
5. Historia Clínica Electrónica & Exportación PDF: Diligenciamiento clínico, tabla dinámica de medicamentos y generación de documentos PDF consolidados.
