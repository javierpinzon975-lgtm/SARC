# SARC — Versión React

Migración funcional completa del proyecto SARC (Sistema de Agendamiento, Recordatorio
y Cancelación de Citas) desde HTML + CSS + JavaScript vanilla a **React 18 + Vite**.

## Cómo ejecutarlo

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

Esto abre el proyecto en `http://localhost:5173`.

Para generar la versión de producción (archivos estáticos listos para hosting):

```bash
npm run build
npm run preview   # para previsualizar el build
```

## Estructura del proyecto

```
sarc-react/
├── public/img/          → Background.png, Logo_PG.png, Logo_Sistema.png
├── src/
│   ├── components/       → Un componente por cada bloque de la interfaz original
│   ├── context/           → AppContext (usuarios, citas, historiales, sesión)
│   │                        ToastContext (notificaciones)
│   ├── data/constants.js  → Recepcionista, médicos, especialidades, horarios
│   ├── utils/
│   │   ├── helpers.js             → calcularEdad, getBase64ImageFromUrl
│   │   ├── pdf.js                 → generación de PDFs con jsPDF + autoTable
│   │   └── usePersistentState.js  → hook que sincroniza estado con localStorage
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css          → mismo diseño glassmorphism del proyecto original
└── index.html
```

## Qué cambió respecto a la versión original

- **Sin manipulación directa del DOM**: todo `document.getElementById`,
  `innerHTML`, `onclick="..."` del `script.js` original se reemplazó por estado
  de React (`useState`/`useContext`) y renderizado declarativo.
- **Estado global** (`usuariosRegistrados`, `citasGlobales`, `historialesClinicos`)
  vive en `AppContext` y se persiste automáticamente en `localStorage`
  (mismas claves que la versión original: `usuariosRegistrados`, `citasGlobales`,
  `historialesClinicos`), por lo que el comportamiento de "base de datos" en el
  navegador se mantiene igual.
- **Notificaciones (toast)** y el **overlay de bienvenida** ahora son componentes
  React (`ToastContext`, `WelcomeOverlay`) en lugar de funciones que inyectan HTML.
- **Generación de PDF** (`jsPDF` + `jspdf-autotable`) se movió a `src/utils/pdf.js`
  como funciones puras que reciben datos y se importan donde se necesitan
  (panel de paciente, panel médico, modal HCE) — la lógica interna de cada PDF
  es la misma que la original.
- **El modal HCE** (`HCEModal.jsx`) es ahora un componente controlado que recibe
  el `citaId` seleccionado y administra su propio formulario (diagnóstico,
  evolución, tabla dinámica de medicamentos) con estado local.
- Las imágenes se renombraron sin espacios ni `&` (`Logo_P_G.png` → `Logo_PG.png`)
  para evitar problemas de rutas en el bundler; el logo del sistema y el fondo
  se sirven desde `public/img/`.


