import { useApp } from '../context/AppContext';
import { generarPDFParte } from '../utils/pdf';
import { calcularEdad } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

export default function PatientAppointmentsTable() {
    const { currentUser, citasGlobales, historialesClinicos, obtenerPacientePorId } = useApp();
    const { showToast } = useToast();

    const misCitas = citasGlobales.filter(c => c.pacienteId === currentUser.id);

    async function descargarParte(citaId) {
        const cita = citasGlobales.find(c => c.idCita === citaId);
        if (!cita) return;

        const paciente = obtenerPacientePorId(cita.pacienteId);
        const edad = paciente && paciente.fechaNacimiento ? calcularEdad(paciente.fechaNacimiento) : 'N/A';
        const historial = historialesClinicos[cita.pacienteId] || [];
        const parte = historial.find(h => h.citaId === citaId);

        if (!parte) {
            showToast('No se encontró parte médico para esta cita.', 'danger');
            return;
        }

        await generarPDFParte(cita, parte, edad, parte.medicoNombre, parte.medicoId);
    }

    return (
        <div className="table-container">
            <table id="table-paciente-citas">
                <thead>
                    <tr>
                        <th>Médico</th>
                        <th>Especialidad</th>
                        <th>Fecha y Hora</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {misCitas.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>No registra citas médicas activas.</td></tr>
                    ) : misCitas.map(c => {
                        const historial = historialesClinicos[c.pacienteId] || [];
                        const tieneParte = historial.some(h => h.citaId === c.idCita);
                        return (
                            <tr key={c.idCita}>
                                <td>{c.medicoNombre}</td>
                                <td>{c.especialidad}</td>
                                <td>{c.fecha} - {c.hora}</td>
                                <td><span className={`status-badge ${c.estado.toLowerCase()}`}>{c.estado}</span></td>
                                <td>
                                    {tieneParte ? (
                                        <button className="btn-action-notify" onClick={() => descargarParte(c.idCita)}>
                                            Descargar Parte PDF
                                        </button>
                                    ) : (
                                        <em style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pendiente por atención</em>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
