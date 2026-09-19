import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { obtenerFechaActualISO } from '../utils/helpers';
import HCEModal from './HCEModal';
import AgendaCalendario from './AgendaCalendario';
import MiniCalendario from './MiniCalendario';

export default function DoctorPanel() {
    const { currentUser, obtenerAgendaPorFecha, historialesClinicos, logout } = useApp();
    const [citaAbiertaId, setCitaAbiertaId] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaActualISO());

    const citasDelDia = obtenerAgendaPorFecha(fechaSeleccionada)
        .filter(c => c.medicoId === currentUser.id && ['Confirmada', 'Terminada'].includes(c.estado));

    if (citaAbiertaId) {
        return <HCEModal citaId={citaAbiertaId} onClose={() => setCitaAbiertaId(null)} />;
    }

    return (
        <section id="panel-medico" className="glass-card role-panel doctor-calendar" style={{ display: 'block' }}>
            <div className="panel-header">
                <div>
                    <p className="calendar-eyebrow">AGENDA PROFESIONAL</p>
                    <h2>Horarios semanales</h2>
                </div>
                <div className="user-info-badge">
                    <span>{currentUser.nombre} ({currentUser.especialidad})</span>
                    <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
                </div>
            </div>

            <div className="doctor-workspace">
                <aside className="mini-calendar-column">
                    <div className="mini-calendar-intro">
                        <span className="calendar-eyebrow">Selecciona un día</span>
                        <h3>Tu agenda</h3>
                        <p>Elige una fecha para ver tus horas y consultas programadas.</p>
                    </div>
                    <MiniCalendario
                        fechaSeleccionada={fechaSeleccionada}
                        onChange={setFechaSeleccionada}
                    />
                    <div className="selected-date-note">
                        <span>Fecha seleccionada</span>
                        <strong>{fechaSeleccionada}</strong>
                    </div>
                </aside>
                <div className="hours-calendar-column">
                    <div className="hours-calendar-heading">
                        <span className="calendar-eyebrow">Panel de horas</span>
                        <h3>Mi agenda de pacientes</h3>
                        <p>Selecciona una cita para abrir el Historial Clínico Electrónico (HCE).</p>
                    </div>
                    <AgendaCalendario
                        fecha={fechaSeleccionada}
                        citas={citasDelDia}
                        mostrarDisponibles
                        renderCita={citaAsignada => {
                            const historial = historialesClinicos[citaAsignada.pacienteId] || [];
                            const tieneParte = historial.some(h => h.citaId === citaAsignada.idCita);
                            const estadoTexto = tieneParte
                                ? 'Parte listo'
                                : (citaAsignada.estado === 'Confirmada' ? 'Cita confirmada' : citaAsignada.estado);
                            const badgeClass = tieneParte
                                ? 'confirmada parte-listo'
                                : citaAsignada.estado.toLowerCase();

                            return (
                                <article
                                    className="calendar-event doctor-event"
                                    key={citaAsignada.idCita}
                                    onClick={() => setCitaAbiertaId(citaAsignada.idCita)}
                                    role="button"
                                    tabIndex="0"
                                    onKeyDown={e => e.key === 'Enter' && setCitaAbiertaId(citaAsignada.idCita)}
                                >
                                    <div className="calendar-event-main">
                                        <strong>{citaAsignada.pacienteNombre}</strong>
                                        <span>{citaAsignada.especialidad}</span>
                                        <small>{citaAsignada.celular} · {citaAsignada.correo}</small>
                                    </div>
                                    <span className={`status-badge ${badgeClass}`}>{estadoTexto}</span>
                                </article>
                            );
                        }}
                    />
                </div>
            </div>

        </section>
    );
}
