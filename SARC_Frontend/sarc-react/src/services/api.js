const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function solicitar(ruta, opciones = {}) {
    const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
        ...opciones,
        headers: {
            ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
            ...opciones.headers
        }
    });
    const texto = await respuesta.text();
    let contenido = null;
    if (texto) {
        try {
            contenido = JSON.parse(texto);
        } catch {
            throw new Error('El API devolvió una respuesta que no es JSON válido.');
        }
    }

    if (!respuesta.ok) {
        const mensaje = contenido?.error || `Error del servidor (${respuesta.status}).`;
        throw new Error(mensaje);
    }

    return contenido;
}

function enviarJson(metodo, datos) {
    return {
        method: metodo,
        body: JSON.stringify(datos)
    };
}

export const listarUsuarios = () => solicitar('/usuarios');
export const registrarUsuario = datos => solicitar('/usuarios', enviarJson('POST', datos));
export const iniciarSesion = datos => solicitar('/usuarios/login', enviarJson('POST', datos));
export const listarCitas = () => solicitar('/citas');
export const crearCita = datos => solicitar('/citas', enviarJson('POST', datos));
export const cancelarCita = id => solicitar(`/citas/${id}/cancelar`, { method: 'PUT' });
export const listarPartesMedicos = () => solicitar('/partes-medicos');
export const guardarParteMedico = (citaId, datos) =>
    solicitar(`/partes-medicos/${citaId}`, enviarJson('PUT', datos));
export const listarEspecialidades = () => solicitar('/especialidades');
