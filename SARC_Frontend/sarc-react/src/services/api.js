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

function conToken(accessToken) {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export const listarUsuarios = accessToken =>
    solicitar('/usuarios', { headers: conToken(accessToken) });
export const listarMedicos = () => solicitar('/usuarios/medicos');
export const registrarUsuario = datos => solicitar('/usuarios', enviarJson('POST', datos));
export const iniciarSesion = datos => solicitar('/usuarios/login', enviarJson('POST', datos));
export const crearCuentaPersonal = (datos, claveAdmin) => solicitar('/usuarios/personal', {
    ...enviarJson('POST', datos),
    headers: { 'X-Admin-Password': claveAdmin }
});
export const listarCitas = accessToken =>
    solicitar('/citas', { headers: conToken(accessToken) });
export const crearCita = (datos, accessToken) => solicitar('/citas', {
    ...enviarJson('POST', datos),
    headers: conToken(accessToken)
});
export const enviarRecordatorioCita = (idCita, canal, accessToken) => solicitar(
    `/citas/${idCita}/recordatorios`,
    {
        ...enviarJson('POST', { canal: canal.toUpperCase() }),
        headers: { Authorization: `Bearer ${accessToken}` }
    }
);
export const cancelarCita = (id, accessToken) => solicitar(`/citas/${id}/cancelar`, {
    method: 'PUT',
    headers: conToken(accessToken)
});
export const listarPartesMedicos = accessToken =>
    solicitar('/partes-medicos', { headers: conToken(accessToken) });
export const guardarParteMedico = (citaId, datos, accessToken) =>
    solicitar(`/partes-medicos/${citaId}`, {
        ...enviarJson('PUT', datos),
        headers: conToken(accessToken)
    });
export const listarEspecialidades = () => solicitar('/especialidades');
