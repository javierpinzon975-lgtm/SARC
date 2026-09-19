import { BLOQUES_HORARIOS } from '../data/constants';

function formatearFecha(fecha) {
    if (!fecha) return '';
    return new Intl.DateTimeFormat('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(`${fecha}T12:00:00`));
}

export default function AgendaCalendario({ fecha, citas, renderCita, mostrarDisponibles = false }) {
    const citasPorHora = BLOQUES_HORARIOS.map(hora => ({
        hora,
        citas: citas.filter(cita => cita.hora === hora)
    }));
    const citasFueraDeHorario = citas.filter(cita => !BLOQUES_HORARIOS.includes(cita.hora));
    const totalCitas = citas.length;

    return (
        <div className="calendar-shell">
            <div className="calendar-heading">
                <div>
                    <span className="calendar-eyebrow">Agenda del día</span>
                    <h3>{formatearFecha(fecha)}</h3>
                </div>
                <div className="calendar-summary">
                    <strong>{totalCitas}</strong>
                    <span>{totalCitas === 1 ? 'cita programada' : 'citas programadas'}</span>
                </div>
            </div>

            <div className="calendar-grid">
                {citasPorHora.map(({ hora, citas: citasDeLaHora }) => (
                    <div className="calendar-row" key={hora}>
                        <div className="calendar-time">{hora}</div>
                        <div className={`calendar-slot ${citasDeLaHora.length === 0 ? 'calendar-slot-empty' : ''}`}>
                            {citasDeLaHora.length > 0
                                ? citasDeLaHora.map(cita => renderCita(cita))
                                : mostrarDisponibles && <span className="calendar-available">Disponible para agendamiento</span>}
                        </div>
                    </div>
                ))}
                {citasFueraDeHorario.map(cita => (
                    <div className="calendar-row" key={cita.idCita}>
                        <div className="calendar-time">{cita.hora}</div>
                        <div className="calendar-slot">{renderCita(cita)}</div>
                    </div>
                ))}
            </div>

            {totalCitas === 0 && !mostrarDisponibles && (
                <div className="calendar-empty">
                    <span className="calendar-empty-icon">✦</span>
                    <strong>Tu agenda está despejada</strong>
                    <span>No hay citas registradas para este día.</span>
                </div>
            )}
        </div>
    );
}
