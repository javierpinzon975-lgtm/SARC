import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { calcularEdad } from '../utils/helpers';
import { generarPDFParte, generarPDFHistorial } from '../utils/pdf';
import { useToast } from '../context/ToastContext';

export default function HCEModal({ citaId, onClose }) {
    const { currentUser, citasGlobales, historialesClinicos, obtenerPacientePorId, guardarParteMedico } = useApp();
    const { showToast } = useToast();

    const cita = citasGlobales.find(c => c.idCita === citaId);
    const paciente = cita ? obtenerPacientePorId(cita.pacienteId) : null;
    const edad = paciente && paciente.fechaNacimiento ? calcularEdad(paciente.fechaNacimiento) : 'No registrada';
    const historial = cita ? (historialesClinicos[cita.pacienteId] || []) : [];
    const parteExistente = historial.find(h => h.citaId === citaId);

    const [diagnostico, setDiagnostico] = useState(parteExistente ? parteExistente.diagnostico : '');
    const [evolucion, setEvolucion] = useState(parteExistente ? parteExistente.evolucion : '');
    const [medicamentos, setMedicamentos] = useState(
        parteExistente && parteExistente.medicamentos && parteExistente.medicamentos.length > 0
            ? parteExistente.medicamentos
            : [{ nombre: '', cantidad: '' }]
    );

    // Reinicia el formulario si cambia la cita seleccionada
    useEffect(() => {
        setDiagnostico(parteExistente ? parteExistente.diagnostico : '');
        setEvolucion(parteExistente ? parteExistente.evolucion : '');
        setMedicamentos(
            parteExistente && parteExistente.medicamentos && parteExistente.medicamentos.length > 0
                ? parteExistente.medicamentos
                : [{ nombre: '', cantidad: '' }]
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [citaId]);

    if (!cita) return null;

    function actualizarMedicamento(idx, campo, valor) {
        setMedicamentos(prev => prev.map((m, i) => i === idx ? { ...m, [campo]: valor } : m));
    }

    function agregarFila() {
        setMedicamentos(prev => [...prev, { nombre: '', cantidad: '' }]);
    }

    function eliminarFila(idx) {
        setMedicamentos(prev => prev.filter((_, i) => i !== idx));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const medicamentosValidos = medicamentos
            .map(m => ({ nombre: m.nombre.trim(), cantidad: m.cantidad.trim() }))
            .filter(m => m.nombre && m.cantidad);

        guardarParteMedico(citaId, {
            medicoNombre: currentUser.nombre,
            medicoId: currentUser.id,
            diagnostico: diagnostico.trim(),
            evolucion: evolucion.trim(),
            medicamentos: medicamentosValidos
        });
        onClose();
    }

    async function descargarPDFParteMedico() {
        const historialActual = historialesClinicos[cita.pacienteId] || [];
        const parte = historialActual.find(h => h.citaId === citaId);
        if (!parte) {
            showToast('Primero guarde el parte médico antes de generar el PDF.', 'danger');
            return;
        }
        await generarPDFParte(cita, parte, edad, currentUser.nombre, currentUser.id);
    }

    async function descargarHistorialCompleto() {
        const historialActual = historialesClinicos[cita.pacienteId] || [];
        await generarPDFHistorial(cita.pacienteNombre, cita.pacienteId, edad, historialActual);
    }

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content glass-card">
                <div className="modal-header">
                    <h3>Historia Clínica Electrónica (HCE) - Parte Médico</h3>
                    <button type="button" className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <div className="hce-info-bar">
                    <strong>Institución:</strong> P&amp;G Servicios Médicos |{' '}
                    <strong>Paciente:</strong> {cita.pacienteNombre} |{' '}
                    <strong>ID:</strong> {cita.pacienteId} |{' '}
                    <strong>Edad:</strong> {edad} años |{' '}
                    <strong>Fecha Atención:</strong> {cita.fecha} {cita.hora} |{' '}
                    <strong>Médico:</strong> {currentUser.nombre} (ID: {currentUser.id})
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="hce-diagnostico">
                            Diagnóstico{' '}
                            <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
                                (Descripción clínica de la enfermedad, patología o lesión diagnosticada)
                            </span>
                        </label>
                        <textarea
                            id="hce-diagnostico" rows="4" required
                            placeholder="Ej: Paciente presenta infección respiratoria aguda con fiebre de 38.5°C..."
                            value={diagnostico}
                            onChange={e => setDiagnostico(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="hce-evolucion">
                            Evolución / Pronóstico{' '}
                            <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
                                (Estado actual, tratamientos aplicados, recomendaciones o pronóstico de recuperación)
                            </span>
                        </label>
                        <textarea
                            id="hce-evolucion" rows="4" required
                            placeholder="Ej: Estado estable. Se prescribe tratamiento antibiótico por 7 días. Control en 8 días..."
                            value={evolucion}
                            onChange={e => setEvolucion(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Medicamentos Formulados</label>
                        <table className="table-meds">
                            <thead>
                                <tr>
                                    <th style={{ width: '70%' }}>Nombre del Medicamento</th>
                                    <th style={{ width: '25%' }}>Cantidad</th>
                                    <th style={{ width: '5%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicamentos.map((m, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <input
                                                type="text" required placeholder="Nombre del medicamento"
                                                value={m.nombre}
                                                onChange={e => actualizarMedicamento(idx, 'nombre', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text" required placeholder="Ej: 1 caja / 10 mg"
                                                value={m.cantidad}
                                                onChange={e => actualizarMedicamento(idx, 'cantidad', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                type="button" className="btn-action-cancel"
                                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                                onClick={() => eliminarFila(idx)}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" className="btn-secondary" onClick={agregarFila}>+ Agregar Medicamento</button>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-success">Guardar Parte Médico</button>
                        <button type="button" className="btn-primary" onClick={descargarPDFParteMedico}>Descargar PDF Parte Médico</button>
                        <button type="button" className="btn-primary" onClick={descargarHistorialCompleto}>Descargar Historial Clínico PDF</button>
                        <button type="button" className="btn-danger" onClick={onClose}>Cerrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
