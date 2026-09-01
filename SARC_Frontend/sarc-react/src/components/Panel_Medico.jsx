import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BLOQUES_HORARIOS } from '../data/constants';
import { obtenerFechaActualISO } from '../utils/helpers';
import HCEModal from './HCEModal';

export default function DoctorPanel() {
    const { currentUser, obtenerAgendaPorFecha, historialesClinicos, logout } = useApp();
    const [citaAbiertaId, setCitaAbiertaId] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaActualISO());

    const citasDelDia = obtenerAgendaPorFecha(fechaSeleccionada)
        .filter(c => c.medicoId === currentUser.id && c.estado === 'Confirmada');

    return (
        <section id="panel-medico" className="glass-card role-panel" style={{ display: 'block' }}>
            <div className="panel-header">
                <h2>Panel Médico General</h2>
                <div className="user-info-badge">
                    <span>{currentUser.nombre} ({currentUser.especialidad})</span>
                    <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
                </div>
            </div>

            <div className="form-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h3>Mi Agenda de Pacientes (8:00 a.m. - 5:00 p.m.)</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        Haga clic sobre una cita <strong>"Ocupado"</strong> para abrir la Historia Clínica Electrónica (HCE) y diligenciar el parte médico.
                    </p>
                </div>
                <div className="form-group">
                    <label htmlFor="medico-date">Fecha de agenda</label>
                    <input
                        type="date"
                        id="medico-date"
                        value={fechaSeleccionada}
                        onChange={e => setFechaSeleccionada(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table id="table-medico-citas">
                    <thead>
                        <tr>
                            <th>Hora</th>
                            <th>Paciente</th>
                            <th>Identificación</th>
                            <th>Contacto</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {BLOQUES_HORARIOS.map(hora => {
                            const citaAsignada = citasDelDia.find(c => c.hora === hora);

                            if (citaAsignada) {
                                const historial = historialesClinicos[citaAsignada.pacienteId] || [];
                                const tieneParte = historial.some(h => h.citaId === citaAsignada.idCita);
                                const estadoTexto = tieneParte ? 'Ocupado (Parte listo)' : 'Ocupado';
                                const badgeClass = tieneParte ? 'confirmada parte-listo' : 'confirmada';

                                return (
                                    <tr
                                        key={hora}
                                        className="fila-cita-ocupada"
                                        style={{ background: 'rgba(46, 204, 113, 0.08)', cursor: 'pointer' }}
                                        onClick={() => setCitaAbiertaId(citaAsignada.idCita)}
                                    >
                                        <td><strong>{hora}</strong></td>
                                        <td>{citaAsignada.pacienteNombre}</td>
                                        <td>{citaAsignada.pacienteId}</td>
                                        <td>{citaAsignada.celular} / {citaAsignada.correo}</td>
                                        <td><span className={`status-badge ${badgeClass}`}>{estadoTexto}</span></td>
                                    </tr>
                                );
                            }

                            return (
                                <tr key={hora}>
                                    <td><span style={{ color: 'var(--text-muted)' }}>{hora}</span></td>
                                    <td colSpan="3" style={{ color: '#27ae60', fontStyle: 'italic' }}>Disponible para Agendamiento</td>
                                    <td><span className="status-badge" style={{ background: '#e8f4f8', color: '#2980b9' }}>Libre</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {citaAbiertaId && (
                <HCEModal citaId={citaAbiertaId} onClose={() => setCitaAbiertaId(null)} />
            )}
        </section>
    );
}
