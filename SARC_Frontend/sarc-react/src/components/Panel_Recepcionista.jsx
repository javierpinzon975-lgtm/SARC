import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { obtenerFechaActualISO } from '../utils/helpers';
import AgendaCalendario from './AgendaCalendario';
import MiniCalendario from './MiniCalendario';

export default function ReceptionistPanel() {
    const { currentUser, obtenerAgendaPorFecha, enviarRecordatorio, cancelarCita, logout } = useApp();
    const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaActualISO());

    const citasDelDia = obtenerAgendaPorFecha(fechaSeleccionada);

    function handleCancelar(idCita) {
        if (window.confirm('¿Está seguro de que desea cancelar esta cita debido a cambios imprevistos en la agenda del especialista?')) {
            cancelarCita(idCita);
        }
    }

    return (
        <section id="panel-recepcionista" className="glass-card role-panel doctor-calendar receptionist-calendar" style={{ display: 'block' }}>
            <div className="panel-header">
                <div>
                    <p className="calendar-eyebrow">GESTIÓN PROFESIONAL</p>
                    <h2>Agenda de recepción</h2>
                </div>
                <div className="user-info-badge">
                    <span>{currentUser.nombre} (Recepcionista)</span>
                    <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
                </div>
            </div>

            <div className="doctor-workspace">
                <aside className="mini-calendar-column">
                    <div className="mini-calendar-intro">
                        <span className="calendar-eyebrow">Selecciona un día</span>
                        <h3>Agenda general</h3>
                        <p>Elige una fecha para gestionar las citas de la jornada.</p>
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
                        <span className="calendar-eyebrow">Panel de citas</span>
                        <h3>Gestión de citas</h3>
                        <p>Consulta la disponibilidad y gestiona cada cita desde una vista rápida.</p>
                    </div>
                    <AgendaCalendario
                        fecha={fechaSeleccionada}
                        citas={citasDelDia}
                        mostrarDisponibles
                        renderCita={c => (
                            <article className={`calendar-event reception-event ${c.estado.toLowerCase()}`} key={c.idCita}>
                                <div className="calendar-event-main">
                                    <strong>{c.pacienteNombre}</strong>
                                    <span>{c.especialidad} · {c.medicoNombre}</span>
                                    <small>ID {c.pacienteId}</small>
                                </div>
                                <div className="calendar-event-meta">
                                    <span className={`status-badge ${c.estado.toLowerCase()}`}>{c.estado}</span>
                                    {c.estado === 'Confirmada' ? (
                                        <div className="calendar-event-actions">
                                            <button
                                                className="btn-action-notify btn-action-sms"
                                                onClick={() => enviarRecordatorio(c.idCita, 'sms')}
                                                aria-label={`Notificar a ${c.pacienteNombre} por SMS`}
                                            >
                                                SMS
                                            </button>
                                            <button
                                                className="btn-action-notify btn-action-email"
                                                onClick={() => enviarRecordatorio(c.idCita, 'correo')}
                                                aria-label={`Notificar a ${c.pacienteNombre} por correo electrónico`}
                                            >
                                                Correo
                                            </button>
                                            <button className="btn-action-cancel" onClick={() => handleCancelar(c.idCita)}>Cancelar</button>
                                        </div>
                                    ) : <em>Sin acciones</em>}
                                </div>
                            </article>
                        )}
                    />
                </div>
            </div>
        </section>
    );
}
