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

## Conexión con el backend

Inicie primero `SARC_Backend` en el puerto `8080`. El frontend usa
`http://localhost:8080/api` de forma predeterminada; para cambiarlo, defina
`VITE_API_BASE_URL` antes de ejecutar Vite, por ejemplo
`VITE_API_BASE_URL=http://localhost:8080/api`.

Los usuarios, las citas y los historiales se cargan y guardan mediante la API.
Los datos que ya existían en `localStorage` no se migran y permanecen en el
navegador, pero ya no se usan como fuente de datos. El backend guarda sus datos
en `proyecto_sarc_api`, separado del esquema legado de `../../Data_Base/Data_Base.sql`.

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
│   ├── data/constants.js  → Tipos de identificación y horarios
│   ├── services/api.js    → Cliente REST del backend Spring Boot
│   ├── utils/
│   │   ├── helpers.js             → calcularEdad, getBase64ImageFromUrl
│   │   ├── pdf.js                 → generación de PDFs con jsPDF + autoTable
│   │   └── usePersistentState.js  → hook legado de persistencia local
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css          → mismo diseño glassmorphism del proyecto original
└── index.html
```


