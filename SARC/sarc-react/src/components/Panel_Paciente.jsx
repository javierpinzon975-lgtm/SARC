import { useApp } from '../context/AppContext';
import BookingForm from './BookingForm';
import PatientAppointmentsTable from './PatientAppointmentsTable';
import { generarPDFHistorial } from '../utils/pdf';
import { calcularEdad } from '../utils/helpers';

export default function PatientPanel() {
    const { currentUser, historialesClinicos, logout } = useApp();

    async function descargarMiHistorialPDF() {
        const edad = currentUser.fechaNacimiento ? calcularEdad(currentUser.fechaNacimiento) : 'N/A';
        const historial = historialesClinicos[currentUser.id] || [];
        await generarPDFHistorial(currentUser.nombre, currentUser.id, edad, historial);
    }

    return (
        <section id="panel-paciente" className="glass-card role-panel" style={{ display: 'block' }}>
            <div className="panel-header">
                <h2>Panel del Paciente</h2>
                <div className="user-info-badge">
                    <span>{currentUser.nombre}</span> (<span>Régimen: {currentUser.regimen}</span>)
                    <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
                </div>
            </div>

            <div className="panel-grid">
                <div className="panel-col">
                    <h3>Solicitar Cita Médica</h3>
                    <BookingForm />
                </div>

                <div className="panel-col">
                    <div className="section-header-actions">
                        <h3>Mis Citas Agendadas</h3>
                        <button type="button" className="btn-primary btn-small" onClick={descargarMiHistorialPDF}>
                            Descargar Historial Clínico PDF
                        </button>
                    </div>
                    <PatientAppointmentsTable />
                </div>
            </div>
        </section>
    );
}
