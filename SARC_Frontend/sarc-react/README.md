# SARC — Frontend React

Frontend web del proyecto SARC (Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas), desarrollado mediante React 18 y Vite.

Esta aplicación proporciona la interfaz de usuario para los perfiles de paciente, médico y recepcionista. Se comunica con el backend Spring Boot mediante una API REST para consultar y gestionar la información del sistema.

## Requisitos previos

Para ejecutar el frontend se requiere:

- Node.js 18 o superior.
- npm (incluido con Node.js).
- Backend SARC en ejecución para utilizar las funcionalidades que requieren conexión con la API.

## Instalación y ejecución

Desde una terminal, ingresar a la carpeta del frontend:

```bash
cd SARC_Frontend/sarc-react
```

Instalar las dependencias del proyecto:

```bash
npm install
```

Crear el archivo local de configuración a partir de la plantilla:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**Linux / macOS:**

```bash
cp .env.example .env.local
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite inicia la aplicación en la siguiente dirección:

```text
http://localhost:5173
```

## Conexión con el backend

El frontend se comunica con el backend de SARC mediante solicitudes HTTP a una API REST desarrollada con Spring Boot.

El backend debe estar iniciado y disponible en el puerto `8080`.

La dirección predeterminada de la API es:

```text
http://localhost:8080/api
```

Esta dirección puede modificarse mediante la variable de entorno `VITE_API_BASE_URL`.

### Configuración de la API

El proyecto incluye el archivo `.env.example`, que contiene la configuración de referencia:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Para utilizar una dirección diferente, modificar el valor de `VITE_API_BASE_URL` en el archivo `.env.local`.

Después de modificar la configuración, reiniciar el servidor de desarrollo de Vite para que tome los nuevos valores.

### Comunicación y persistencia de información

El frontend utiliza el módulo `src/services/api.js` para centralizar las solicitudes hacia los endpoints del backend.

Las operaciones de registro, autenticación, consulta de usuarios, gestión de citas e información clínica se realizan mediante la API.

El frontend no se conecta directamente a MySQL. La persistencia de la información es administrada por el backend, que utiliza Spring Data JPA y MySQL.

Los datos que existían en `localStorage` durante versiones anteriores del proyecto no se migran ni se utilizan como fuente de datos principal de la versión actual.

## Tecnologías y dependencias

| Tecnología / Librería | Función |
|---|---|
| React 18 | Construcción de interfaces mediante componentes. |
| React DOM | Renderizado de la aplicación en el navegador. |
| Vite 5 | Servidor de desarrollo y herramienta de compilación. |
| JavaScript ES6+ | Lógica e interacción de la aplicación. |
| CSS | Diseño visual y estilos de la interfaz. |
| jsPDF | Generación de documentos PDF. |
| jspdf-autotable | Generación de tablas en documentos PDF. |

## Estructura del proyecto

```text
sarc-react/
│
├── public/
│   └── img/
│       ├── Background.png
│       ├── Logo_PG.png
│       └── Logo_Sistema.png
│
├── src/
│   ├── components/
│   │
│   ├── context/
│   │   ├── AppContext.jsx
│   │   └── ToastContext.jsx
│   │
│   ├── data/
│   │   └── constants.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── pdf.js
│   │   └── usePersistentState.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

### Descripción de los módulos principales

| Módulo | Responsabilidad |
|---|---|
| `components/` | Componentes visuales y funcionales de la interfaz. |
| `context/` | Administración del estado global, usuarios, citas, sesiones y notificaciones. |
| `data/` | Constantes y datos de configuración utilizados por la aplicación. |
| `services/` | Comunicación con los servicios y endpoints del backend. |
| `utils/` | Funciones auxiliares, generación de PDF y utilidades del proyecto. |
| `App.jsx` | Componente principal de la aplicación. |
| `main.jsx` | Punto de entrada y renderizado de React. |
| `index.css` | Estilos generales de la interfaz. |

## Compilación para producción

Para generar los archivos estáticos de producción:

```bash
npm run build
```

Vite genera el resultado de la compilación en:

```text
dist/
```

Para ejecutar una previsualización local de la versión compilada:

```bash
npm run preview
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm install` | Instala las dependencias del proyecto. |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Compila la aplicación para producción. |
| `npm run preview` | Previsualiza localmente la compilación. |

## Consideraciones de funcionamiento

- El frontend requiere que el backend esté disponible para utilizar las operaciones que dependen de la API REST.
- La dirección del backend se configura mediante `VITE_API_BASE_URL`.
- El token de autenticación se mantiene en memoria durante la sesión; al recargar la página se debe iniciar sesión nuevamente.
- Las dependencias del proyecto se encuentran declaradas en `package.json` y se instalan mediante `npm install`.
- El archivo `.env.example` se conserva como plantilla de configuración. El archivo `.env.local` contiene la configuración local y no debe publicarse en el repositorio.

---

**SARC — Sistema de Agendamiento, Recordatorio y Cancelación de Citas Médicas**
