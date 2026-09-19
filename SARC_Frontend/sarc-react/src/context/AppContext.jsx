import { createContext, useContext, useEffect, useState } from 'react';
import { usePersistentState } from '../utils/usePersistentState';
import { useToast } from './ToastContext';
import { RECEPCIONISTA, MEDICOS } from '../data/constants';
import { convertirHoraCitaAMomento, puedeAgendarseLaCita, puedeGenerarParteMedico } from '../utils/helpers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [usuariosRegistrados, setUsuariosRegistrados] = usePersistentState('usuariosRegistrados', []);
    const [citasGlobales, setCitasGlobales] = usePersistentState('citasGlobales', []);
    const [citasPorFecha, setCitasPorFecha] = usePersistentState('citasPorFecha', {});
    const [historialesClinicos, setHistorialesClinicos] = usePersistentState('historialesClinicos', {});
    const [currentUser, setCurrentUser] = useState(null);
    const [welcomeName, setWelcomeName] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        function actualizarCitasTerminadas() {
            const limiteTerminada = Date.now() - 30 * 60 * 1000;
            const debeMarcarseComoTerminada = cita => {
                if (cita.estado !== 'Confirmada') return false;
                const momentoCita = convertirHoraCitaAMomento(cita.fecha, cita.hora);
                return momentoCita && momentoCita.getTime() <= limiteTerminada;
            };

            const citasActualizadas = citasGlobales.map(cita =>
                debeMarcarseComoTerminada(cita) ? { ...cita, estado: 'Terminada' } : cita
            );
            const huboCambios = citasActualizadas.some((cita, index) => cita !== citasGlobales[index]);

            if (huboCambios) {
                setCitasGlobales(citasActualizadas);
                setCitasPorFecha(prev =>
                    Object.fromEntries(Object.entries(prev).map(([fecha, citas]) => [
                        fecha,
                        citas.map(cita =>
                            debeMarcarseComoTerminada(cita) ? { ...cita, estado: 'Terminada' } : cita
                        )
                    ]))
                );
            }
        }

        actualizarCitasTerminadas();
        const intervalId = window.setInterval(actualizarCitasTerminadas, 60 * 1000);
        return () => window.clearInterval(intervalId);
    }, [citasGlobales, setCitasGlobales, setCitasPorFecha]);

    function registrarPaciente({ nombre, id, fechaNacimiento = '', regimen = '', celular = '', correo = '' }) {
        if (!nombre || !id) {
            showToast('El nombre completo y la identificación son obligatorios.', 'danger');
            return false;
        }

        if (!fechaNacimiento || !regimen || !celular || !correo) {
            showToast('Para registrar un paciente, debe diligenciar fecha de nacimiento, régimen, celular y correo.', 'danger');
            return false;
        }

        if (usuariosRegistrados.some(u => u.id === id)) {
            showToast('Este número de identificación ya está registrado.', 'danger');
            return false;
        }

        const nuevoUsuario = {
            nombre,
            id,
            fechaNacimiento,
            regimen,
            celular,
            correo,
            tipo: 'paciente'
        };

        setUsuariosRegistrados(prev => [...prev, nuevoUsuario]);

        showToast('Registro de paciente exitoso. Proceda a iniciar sesión.', 'success');
        return true;
    }

    function login({ nombre, id }) {
        if (nombre === RECEPCIONISTA.nombre && id === RECEPCIONISTA.id) {
            setCurrentUser(RECEPCIONISTA);
            dispararBienvenida(RECEPCIONISTA.nombre);
            return RECEPCIONISTA;
        }

        const medicoEncontrado = MEDICOS.find(m => m.nombre.toLowerCase() === nombre.toLowerCase() && m.id === id);
        if (medicoEncontrado) {
            const medico = { ...medicoEncontrado, tipo: 'medico' };
            setCurrentUser(medico);
            dispararBienvenida(medico.nombre);
            return medico;
        }

        const usuarioRegistrado = usuariosRegistrados.find(u => u.nombre.toLowerCase() === nombre.toLowerCase() && u.id === id);
        if (usuarioRegistrado) {
            setCurrentUser(usuarioRegistrado);
            dispararBienvenida(usuarioRegistrado.nombre);
            return usuarioRegistrado;
        }

        showToast('Credenciales no encontradas. Verifique datos o regístrese.', 'danger');
        return null;
    }

    function dispararBienvenida(nombre) {
        showToast(`Bienvenido(a) al sistema, ${nombre}`, 'success');
        setWelcomeName(nombre);
        setTimeout(() => setWelcomeName(null), 3000);
    }

    function logout() {
        setCurrentUser(null);
        showToast('Sesión cerrada correctamente.', 'success');
    }

    function agendarCita(datos) {
        const nuevaCita = { idCita: 'CITA-' + Date.now(), estado: 'Confirmada', ...datos };
        if (!puedeAgendarseLaCita(nuevaCita.fecha, nuevaCita.hora)) {
            showToast('No se puede agendar una cita en una fecha u hora anterior a la actual.', 'danger');
            return false;
        }

        setCitasGlobales(prev => [...prev, nuevaCita]);
        setCitasPorFecha(prev => ({
            ...prev,
            [nuevaCita.fecha]: [...(prev[nuevaCita.fecha] || []), nuevaCita]
        }));
        showToast('Cita agendada correctamente.', 'success');
        return true;
    }

    function enviarRecordatorio(idCita, canal = 'sms') {
        const cita = citasGlobales.find(c => c.idCita === idCita);
        if (!cita) return;
        const esSms = canal === 'sms';
        const medio = esSms
            ? `SMS/WhatsApp (${cita.celular})`
            : `correo electrónico (${cita.correo})`;
        showToast(`Recordatorio enviado a ${cita.pacienteNombre} vía ${medio}.`, 'success');
    }

    function cancelarCita(idCita) {
        const cita = citasGlobales.find(c => c.idCita === idCita);
        if (!cita) return;
        setCitasGlobales(prev => prev.map(c => c.idCita === idCita ? { ...c, estado: 'Cancelada' } : c));
        setCitasPorFecha(prev => {
            const agendaDia = prev[cita.fecha] || [];
            return {
                ...prev,
                [cita.fecha]: agendaDia.map(c => c.idCita === idCita ? { ...c, estado: 'Cancelada' } : c)
            };
        });

        window.alert(`NOTIFICACIÓN ENVIADA AUTOMÁTICAMENTE:

Estimado(a) ${cita.pacienteNombre},
Le informamos que su cita de ${cita.especialidad} programada para el día ${cita.fecha} a las ${cita.hora} ha sido CANCELADA debido a cambios en la agenda del Médico ${cita.medicoNombre}.

Por favor, reingrese al sistema SARC para realizar un nuevo agendamiento.`);

        showToast('Cita cancelada y correo de notificación despachado.', 'danger');
    }

    function guardarParteMedico(citaId, datosParteMedico) {
        const cita = citasGlobales.find(c => c.idCita === citaId);
        if (!cita) {
            showToast('La cita no existe en el ecosistema.', 'danger');
            return false;
        }

        if (!puedeGenerarParteMedico(cita)) {
            showToast('No se puede crear el parte médico antes de la fecha y hora programada de la cita.', 'danger');
            return false;
        }

        const parteMedico = {
            citaId,
            fechaAtencion: cita.fecha,
            horaAtencion: cita.hora,
            fechaEmision: new Date().toLocaleString('es-CO'),
            ...datosParteMedico
        };

        setHistorialesClinicos(prev => {
            const historialPaciente = prev[cita.pacienteId] || [];
            const idx = historialPaciente.findIndex(h => h.citaId === citaId);
            let nuevoHistorial;
            if (idx >= 0) {
                nuevoHistorial = [...historialPaciente];
                nuevoHistorial[idx] = parteMedico;
            } else {
                nuevoHistorial = [...historialPaciente, parteMedico];
            }
            return { ...prev, [cita.pacienteId]: nuevoHistorial };
        });

        showToast('Parte médico guardado correctamente en el HCE.', 'success');
        return true;
    }

    function obtenerPacientePorId(pacienteId) {
        return usuariosRegistrados.find(u => u.id === pacienteId);
    }

    function obtenerAgendaPorFecha(fecha) {
        const agendaGuardada = citasPorFecha[fecha];
        return agendaGuardada || citasGlobales.filter(cita => cita.fecha === fecha);
    }

    const value = {
        usuariosRegistrados,
        citasGlobales,
        citasPorFecha,
        historialesClinicos,
        currentUser,
        welcomeName,
        registrarPaciente,
        login,
        logout,
        agendarCita,
        enviarRecordatorio,
        cancelarCita,
        guardarParteMedico,
        obtenerPacientePorId,
        obtenerAgendaPorFecha
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp debe usarse dentro de un AppProvider');
    return ctx;
}
