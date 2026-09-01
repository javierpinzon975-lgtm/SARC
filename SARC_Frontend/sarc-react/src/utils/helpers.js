export function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

export function obtenerFechaActualISO() {
    const ahora = new Date();
    const fecha = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
    return fecha.toISOString().slice(0, 10);
}

export function obtenerHoraActualSistema() {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function obtenerFechaHoraActualSistema() {
    return new Date().toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'medium'
    });
}

export function convertirHoraCitaAMomento(fecha, hora) {
    if (!fecha || !hora) return null;

    const match = hora.trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
    if (!match) return null;

    let horas = Number.parseInt(match[1], 10);
    const minutos = Number.parseInt(match[2], 10);
    const suffix = match[3].toUpperCase();

    if (suffix === 'PM' && horas < 12) horas += 12;
    if (suffix === 'AM' && horas === 12) horas = 0;

    const fechaHora = new Date(fecha + 'T' + String(horas).padStart(2, '0') + ':' + String(minutos).padStart(2, '0') + ':00');
    return Number.isNaN(fechaHora.getTime()) ? null : fechaHora;
}

export function puedeGenerarParteMedico(cita) {
    if (!cita || !cita.fecha || !cita.hora) return false;
    const fechaHoraCita = convertirHoraCitaAMomento(cita.fecha, cita.hora);
    if (!fechaHoraCita) return false;
    return Date.now() >= fechaHoraCita.getTime();
}

export function fechaDeLaCitaEsAnteriorOIgualAlSistema(fecha, hora) {
    const fechaHoraCita = convertirHoraCitaAMomento(fecha, hora);
    if (!fechaHoraCita) return false;
    return Date.now() >= fechaHoraCita.getTime();
}

export function puedeAgendarseLaCita(fecha, hora) {
    const fechaHoraCita = convertirHoraCitaAMomento(fecha, hora);
    if (!fechaHoraCita) return false;
    return Date.now() < fechaHoraCita.getTime();
}

// Convertir imagen URL a Base64 (para incrustar el logo en los PDFs)
export function getBase64ImageFromUrl(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
    });
}
