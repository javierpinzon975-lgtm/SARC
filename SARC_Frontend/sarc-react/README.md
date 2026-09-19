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




