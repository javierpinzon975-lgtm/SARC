import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { obtenerFechaActualISO } from '../utils/helpers';
import AgendaCalendario from './AgendaCalendario';
import MiniCalendario from './MiniCalendario';

export default function ReceptionistPanel() {
    const { currentUser, citasGlobales, obtenerAgendaPorFecha, enviarRecordatorio, cancelarCita, logout } = useApp();
    const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaActualISO());

    const fechasConCitas = [...new Set(citasGlobales.map(c => c.fecha))];
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
                        fechasConCitas={fechasConCitas}
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
                                                className="btn-action-notify btn-action-sms notification-button"
                                                onClick={() => enviarRecordatorio(c.idCita, 'sms')}
                                                aria-label={`Notificar a ${c.pacienteNombre} por SMS o WhatsApp`}
                                            >
                                                <svg className="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                                    <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.148-.197.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.1-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.893-9.884 2.643.001 5.127 1.03 6.995 2.899a9.825 9.825 0 0 1 2.896 6.99c-.003 5.45-4.437 9.885-9.901 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.946L.057 24l6.304-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.478-8.413Z" />
                                                </svg>
                                                SMS
                                            </button>
                                            <button
                                                className="btn-action-notify btn-action-email notification-button"
                                                onClick={() => enviarRecordatorio(c.idCita, 'correo')}
                                                aria-label={`Notificar a ${c.pacienteNombre} por correo electrónico`}
                                            >
                                                <svg className="mailbox-icon" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
                                                    <path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128c0 20.1 9.5 39 25.6 51.2L256 352l230.4-172.8C502.5 167 512 148.1 512 128c0-35.3-28.7-64-64-64H64zM0 192V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192L275.2 352c-11.4 8.5-27 8.5-38.4 0L0 192z" />
                                                </svg>
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
