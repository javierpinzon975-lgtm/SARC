import { useState } from 'react';
import { useApp } from '../context/AppContext';
import BookingForm from './BookingForm';
import MiniCalendario from './MiniCalendario';
import { generarPDFHistorial } from '../utils/pdf';
import { calcularEdad, obtenerFechaActualISO } from '../utils/helpers';

export default function PatientPanel() {
    const { currentUser, citasGlobales, historialesClinicos, logout } = useApp();
    const [fechaSeleccionada, setFechaSeleccionada] = useState(obtenerFechaActualISO());
    const misCitas = citasGlobales.filter(cita => cita.pacienteId === currentUser.id);
    const citasDelDia = misCitas
        .filter(cita => cita.fecha === fechaSeleccionada)
        .sort((a, b) => a.hora.localeCompare(b.hora));
    const fechasConCitas = [...new Set(misCitas.map(cita => cita.fecha))];

    async function descargarMiHistorialPDF() {
        const edad = currentUser.fechaNacimiento ? calcularEdad(currentUser.fechaNacimiento) : 'N/A';
        const historial = historialesClinicos[currentUser.id] || [];
        await generarPDFHistorial(
            currentUser.nombre,
            currentUser.id,
            edad,
            historial,
            currentUser.tipoIdentificacion || 'CEDULA'
        );
    }

    return (
        <section id="panel-paciente" className="glass-card role-panel" style={{ display: 'block' }}>
            <div className="panel-header">
                <h2>Panel del Paciente</h2>
                <div className="user-info-badge">
                    <span>{currentUser.nombre}</span>
                    <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
                </div>
            </div>

            <div className="panel-grid patient-workspace">
                <div className="panel-col patient-booking-column">
                    <h3>Solicitar Cita Médica</h3>
                    <BookingForm />
                </div>

                <div className="panel-col patient-calendar-column">
                    <div className="patient-calendar-intro">
                        <h3>Mi calendario de citas</h3>
                        <p>Las fechas oscuras indican días con citas asignadas. Selecciona un día para consultar sus detalles.</p>
                    </div>
                    <MiniCalendario
                        fechaSeleccionada={fechaSeleccionada}
                        onChange={setFechaSeleccionada}
                        fechasConCitas={fechasConCitas}
                    />
                    <section className="patient-day-appointments" aria-live="polite">
                        <h4>Citas del {fechaSeleccionada}</h4>
                        {citasDelDia.length > 0 ? (
                            <ul>
                                {citasDelDia.map(cita => (
                                    <li key={cita.idCita}>
                                        <strong>{cita.hora} · {cita.especialidad}</strong>
                                        <span>{cita.medicoNombre}</span>
                                        <span className={`status-badge ${cita.estado.toLowerCase()}`}>{cita.estado}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tienes citas asignadas para esta fecha.</p>
                        )}
                    </section>
                    <button type="button" className="btn-primary patient-history-download" onClick={descargarMiHistorialPDF}>
                        Descargar Historial Clínico PDF
                    </button>
                </div>
            </div>
        </section>
    );
}
