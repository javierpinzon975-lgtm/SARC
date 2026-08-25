import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { MEDICOS, ESPECIALIDADES, BLOQUES_HORARIOS, FECHA_MINIMA } from '../data/constants';

const initialForm = {
    phone: '', email: '', specialty: '', doctorId: '', date: '', time: ''
};

export default function BookingForm() {
    const { currentUser, citasGlobales, agendarCita } = useApp();
    const [form, setForm] = useState(initialForm);

    const medicosFiltrados = useMemo(
        () => (form.specialty ? MEDICOS.filter(m => m.especialidad === form.specialty) : []),
        [form.specialty]
    );

    const horasDisponibles = useMemo(() => {
        if (!form.doctorId || !form.date) return [];
        const horasOcupadas = citasGlobales
            .filter(c => c.medicoId === form.doctorId && c.fecha === form.date && c.estado === 'Confirmada')
            .map(c => c.hora);
        return BLOQUES_HORARIOS.filter(h => !horasOcupadas.includes(h));
    }, [form.doctorId, form.date, citasGlobales]);

    function updateField(field, val) {
        setForm(prev => {
            const next = { ...prev, [field]: val };
            if (field === 'specialty') { next.doctorId = ''; next.time = ''; }
            if (field === 'doctorId' || field === 'date') { next.time = ''; }
            return next;
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const medicoObj = MEDICOS.find(m => m.id === form.doctorId);
        if (!medicoObj) return;

        agendarCita({
            pacienteNombre: currentUser.nombre,
            pacienteId: currentUser.id,
            celular: form.phone,
            correo: form.email,
            especialidad: form.specialty,
            medicoNombre: medicoObj.nombre,
            medicoId: form.doctorId,
            fecha: form.date,
            hora: form.time
        });

        setForm(initialForm);
    }

    return (
        <form id="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" value={currentUser.nombre} readOnly />
            </div>
            <div className="form-group">
                <label>Identificación</label>
                <input type="text" value={currentUser.id} readOnly />
            </div>
            <div className="form-group">
                <label htmlFor="book-phone">Número de Celular</label>
                <input
                    type="tel" id="book-phone" required
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="book-email">Correo Electrónico</label>
                <input
                    type="email" id="book-email" required
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="book-specialty">Especialidad Médica</label>
                <select
                    id="book-specialty" required
                    value={form.specialty}
                    onChange={e => updateField('specialty', e.target.value)}
                >
                    <option value="" disabled>Seleccione la especialidad...</option>
                    {ESPECIALIDADES.map(esp => <option key={esp} value={esp}>{esp}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="book-doctor">Médico Asignado</label>
                <select
                    id="book-doctor" required disabled={!form.specialty}
                    value={form.doctorId}
                    onChange={e => updateField('doctorId', e.target.value)}
                >
                    <option value="" disabled>
                        {form.specialty ? 'Seleccione un profesional...' : 'Primero elija una especialidad...'}
                    </option>
                    {medicosFiltrados.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="book-date">Fecha</label>
                    <input
                        type="date" id="book-date" required min={FECHA_MINIMA}
                        value={form.date}
                        onChange={e => updateField('date', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="book-time">Hora Disponible</label>
                    <select
                        id="book-time" required disabled={!form.doctorId || !form.date}
                        value={form.time}
                        onChange={e => updateField('time', e.target.value)}
                    >
                        <option value="" disabled>
                            {!form.doctorId || !form.date
                                ? 'Seleccione fecha y médico...'
                                : (horasDisponibles.length === 0 ? 'No hay agendas disponibles hoy' : 'Seleccione la hora...')}
                        </option>
                        {horasDisponibles.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
            </div>
            <button type="submit" className="btn-success">Agendar Cita Médica</button>
        </form>
    );
}
