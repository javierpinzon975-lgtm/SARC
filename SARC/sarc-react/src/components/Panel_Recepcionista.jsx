import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { obtenerFechaActualISO } from '../utils/helpers';

export default function ReceptionistPanel() {
    const { currentUser, citasGlobales, enviarRecordatorio, cancelarCita, logout } = useApp();
    const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaActualISO());

    const citasDelDia = citasGlobales.filter(c => c.fecha === fechaSeleccionada);

    function handleCancelar(idCita) {
        if (window.confirm('¿Está seguro de que desea cancelar esta cita debido a cambios imprevistos en la agenda del especialista?')) {
            cancelarCita(idCita);
        }
    }

    return (
        <section id="panel-recepcionista" className="glass-card role-panel" style={{ display: 'block' }}>
            <div className="panel-header">
                <h2>Panel de Recepción</h2>
                <div className="user-info-badge">
                    <span>{currentUser.nombre} (Recepcionista)</span>
                    <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
                </div>
            </div>

            <div className="form-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <h3>Agenda por fecha</h3>
                <div className="form-group">
                    <label htmlFor="recepcionista-date">Fecha de agenda</label>
                    <input
                        type="date"
                        id="recepcionista-date"
                        value={fechaSeleccionada}
                        min={obtenerFechaActualISO()}
                        onChange={e => setFechaSeleccionada(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table id="table-recep-citas">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Identificación</th>
                            <th>Médico</th>
                            <th>Especialidad</th>
                            <th>Fecha/Hora</th>
                            <th>Estado</th>
                            <th>Acciones de Gestión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citasDelDia.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay citas registradas para el día {fechaSeleccionada}.</td></tr>
                        ) : citasDelDia.map(c => (
                            <tr key={c.idCita}>
                                <td><strong>{c.pacienteNombre}</strong></td>
                                <td>{c.pacienteId}</td>
                                <td>{c.medicoNombre}</td>
                                <td>{c.especialidad}</td>
                                <td>{c.fecha} ({c.hora})</td>
                                <td><span className={`status-badge ${c.estado.toLowerCase()}`}>{c.estado}</span></td>
                                <td>
                                    {c.estado === 'Confirmada' ? (
                                        <>
                                            <button className="btn-action-notify" onClick={() => enviarRecordatorio(c.idCita)}>Notificar</button>
                                            <button className="btn-action-cancel" onClick={() => handleCancelar(c.idCita)}>Cancelar</button>
                                        </>
                                    ) : (
                                        <em style={{ color: 'var(--text-muted)' }}>Sin acciones</em>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
