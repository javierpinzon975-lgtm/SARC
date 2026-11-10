import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    cancelarCita as cancelarCitaApi,
    crearCita,
    enviarRecordatorioCita,
    guardarParteMedico as guardarParteMedicoApi,
    iniciarSesion,
    listarCitas,
    listarEspecialidades,
    listarMedicos,
    listarPartesMedicos,
    registrarUsuario
} from '../services/api';
import { useToast } from './ToastContext';
import { TIPOS_IDENTIFICACION } from '../data/constants';
import { calcularEdad, convertirHoraCitaAMomento, puedeAgendarseLaCita, puedeGenerarParteMedico } from '../utils/helpers';

const AppContext = createContext(null);

const ESTADOS_CITA = {
    PROGRAMADA: 'Confirmada',
    COMPLETADA: 'Terminada',
    CANCELADA: 'Cancelada',
    NOSHOW: 'No asistió'
};

function mapUsuario(usuario) {
    return {
        apiId: usuario.id,
        id: usuario.identificacion,
        nombre: usuario.nombre,
        tipo: usuario.tipo.toLowerCase(),
        fechaNacimiento: usuario.fechaNacimiento || '',
        tipoIdentificacion: usuario.tipoIdentificacion || '',
        regimen: usuario.regimen || '',
        celular: usuario.telefono || '',
        correo: usuario.correo || '',
        especialidadId: usuario.especialidadId,
        especialidad: usuario.especialidad || '',
        accessToken: usuario.accessToken || null
    };
}

function mapCita(cita) {
    return {
        idCita: cita.id,
        pacienteApiId: cita.pacienteId,
        pacienteId: cita.pacienteIdentificacion,
        pacienteNombre: cita.pacienteNombre,
        tipoIdentificacion: cita.tipoIdentificacion || '',
        pacienteFechaNacimiento: cita.pacienteFechaNacimiento || '',
        medicoApiId: cita.medicoId,
        medicoId: cita.medicoIdentificacion,
        medicoNombre: cita.medicoNombre,
        especialidad: cita.especialidad,
        recepcionistaApiId: cita.recepcionistaId,
        fecha: cita.fecha,
        hora: formatearHora(cita.hora),
        estado: ESTADOS_CITA[cita.estado] || cita.estado,
        celular: cita.telefono || '',
        correo: cita.correo || ''
    };
}

function formatearHora(hora) {
    const coincidencia = hora.match(/^(\d{1,2}):(\d{2})/);
    if (!coincidencia) return hora;
    const hora24 = Number(coincidencia[1]);
    const periodo = hora24 >= 12 ? 'PM' : 'AM';
    const hora12 = hora24 % 12 || 12;
    return `${String(hora12).padStart(2, '0')}:${coincidencia[2]} ${periodo}`;
}

function convertirHoraApi(hora) {
    const coincidencia = hora.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
    if (!coincidencia) throw new Error('Seleccione una hora válida para la cita.');
    let hora24 = Number(coincidencia[1]) % 12;
    if (coincidencia[3].toUpperCase() === 'PM') hora24 += 12;
    return `${String(hora24).padStart(2, '0')}:${coincidencia[2]}:00`;
}

function mapParte(parte) {
    return {
        citaId: parte.citaId,
        fechaAtencion: parte.fechaAtencion,
        horaAtencion: formatearHora(parte.horaAtencion),
        fechaEmision: parte.fechaEmision,
        diagnostico: parte.diagnostico,
        evolucion: parte.evolucion,
        medicoNombre: parte.medicoNombre,
        medicoId: parte.medicoId,
        medicamentos: parte.medicamentos || []
    };
}

function crearHistorial(partes, citas) {
    const citaPorId = new Map(citas.map(cita => [cita.idCita, cita]));
    return partes.reduce((historiales, parteApi) => {
        const parte = mapParte(parteApi);
        const cita = citaPorId.get(parte.citaId);
        if (cita) {
            historiales[cita.pacienteId] = [...(historiales[cita.pacienteId] || []), parte];
        }
        return historiales;
    }, {});
}

export function AppProvider({ children }) {
    const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);
    const [citasGlobales, setCitasGlobales] = useState([]);
    const [historialesClinicos, setHistorialesClinicos] = useState({});
    const [especialidades, setEspecialidades] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        let activo = true;

        async function cargarDatos() {
            try {
                const [medicosApi, especialidadesApi] = await Promise.all([
                    listarMedicos(),
                    listarEspecialidades()
                ]);
                if (!activo) return;

                setUsuariosRegistrados(medicosApi.map(mapUsuario));
                setEspecialidades(especialidadesApi.map(especialidad => especialidad.nombre));
            } catch (error) {
                if (activo) showToast(`No se pudo conectar con el API: ${error.message}`, 'danger');
            }
        }

        cargarDatos();
        return () => {
            activo = false;
        };
    }, [showToast]);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            const limiteTerminada = Date.now() - 30 * 60 * 1000;
            setCitasGlobales(citas => citas.map(cita => {
                if (cita.estado !== 'Confirmada') return cita;
                const momentoCita = convertirHoraCitaAMomento(cita.fecha, cita.hora);
                return momentoCita && momentoCita.getTime() <= limiteTerminada
                    ? { ...cita, estado: 'Terminada' }
                    : cita;
            }));
        }, 60 * 1000);
        return () => window.clearInterval(intervalId);
    }, []);

    const medicos = useMemo(
        () => usuariosRegistrados.filter(usuario => usuario.tipo === 'medico'),
        [usuariosRegistrados]
    );

    const citasPorFecha = useMemo(
        () => citasGlobales.reduce((agenda, cita) => {
            agenda[cita.fecha] = [...(agenda[cita.fecha] || []), cita];
            return agenda;
        }, {}),
        [citasGlobales]
    );

    async function registrarPaciente({
        nombre,
        id,
        password,
        fechaNacimiento = '',
        tipoIdentificacion = '',
        regimen = ''
    }) {
        if (!nombre || !id) {
            showToast('El nombre completo y la identificación son obligatorios.', 'danger');
            return false;
        }
        if (!password || password.length < 8 || password.length > 72) {
            showToast('La contraseña debe tener entre 8 y 72 caracteres.', 'danger');
            return false;
        }
        if (!fechaNacimiento || !tipoIdentificacion || !regimen) {
            showToast('Para registrar un paciente, debe diligenciar fecha de nacimiento, tipo de documento y régimen.', 'danger');
            return false;
        }

        const edad = calcularEdad(fechaNacimiento);
        if (edad === null || edad < 0) {
            showToast('Ingrese una fecha de nacimiento válida que no sea futura.', 'danger');
            return false;
        }
        if (!TIPOS_IDENTIFICACION.some(tipo => tipo.valor === tipoIdentificacion)) {
            showToast('Seleccione un tipo de documento válido.', 'danger');
            return false;
        }
        if (edad >= 18 && tipoIdentificacion !== 'CEDULA') {
            showToast('Las personas de 18 años o más deben registrarse con cédula.', 'danger');
            return false;
        }

        try {
            const usuarioApi = await registrarUsuario({
                identificacion: id,
                nombre,
                tipo: 'PACIENTE',
                password,
                fechaNacimiento,
                tipoIdentificacion,
                regimen
            });
            setUsuariosRegistrados(prev => [...prev, mapUsuario(usuarioApi)]);
            showToast('Registro de paciente exitoso. Proceda a iniciar sesión.', 'success');
            return true;
        } catch (error) {
            showToast(error.message, 'danger');
            return false;
        }
    }

    async function login({ nombre, id, password, tipo }) {
        try {
            const usuarioApi = await iniciarSesion({
                nombre,
                identificacion: id,
                password,
                tipo
            });
            const usuario = mapUsuario(usuarioApi);
            const [citasApi, partesApi] = await Promise.all([
                listarCitas(usuario.accessToken),
                listarPartesMedicos(usuario.accessToken)
            ]);
            const citas = citasApi.map(mapCita);
            setCurrentUser(usuario);
            setCitasGlobales(citas);
            setHistorialesClinicos(crearHistorial(partesApi, citas));
            const pacientesDeAgenda = usuario.tipo === 'medico'
                ? citas.map(cita => ({
                    apiId: cita.pacienteApiId,
                    id: cita.pacienteId,
                    nombre: cita.pacienteNombre,
                    tipo: 'paciente',
                    fechaNacimiento: cita.pacienteFechaNacimiento,
                    tipoIdentificacion: cita.tipoIdentificacion
                }))
                : [];
            setUsuariosRegistrados(prev => {
                const nuevos = [...pacientesDeAgenda, usuario];
                const otros = prev.filter(actual =>
                    !nuevos.some(nuevo => nuevo.apiId === actual.apiId && nuevo.tipo === actual.tipo)
                );
                return [...otros, ...nuevos];
            });
            return usuario;
        } catch (error) {
            showToast(error.message, 'danger');
            return null;
        }
    }

    function logout() {
        setCurrentUser(null);
        setCitasGlobales([]);
        setHistorialesClinicos({});
        showToast('Sesión cerrada correctamente.', 'success');
    }

    async function agendarCita(datos) {
        if (!puedeAgendarseLaCita(datos.fecha, datos.hora)) {
            showToast('No se puede agendar una cita en una fecha u hora anterior a la actual.', 'danger');
            return false;
        }

        const medico = medicos.find(usuario => usuario.id === datos.medicoId);
        if (!medico || !currentUser?.apiId) {
            showToast('No se encontró el paciente o el médico en el API.', 'danger');
            return false;
        }

        try {
            const citaApi = await crearCita({
                pacienteId: currentUser.apiId,
                medicoId: medico.apiId,
                fecha: datos.fecha,
                hora: convertirHoraApi(datos.hora),
                motivo: datos.especialidad,
                telefono: datos.celular,
                correo: datos.correo
            }, currentUser.accessToken);
            setCitasGlobales(prev => [...prev, mapCita(citaApi)]);
            showToast('Cita agendada correctamente.', 'success');
            return true;
        } catch (error) {
            showToast(error.message, 'danger');
            return false;
        }
    }

    async function enviarRecordatorio(idCita, canal = 'sms') {
        const cita = citasGlobales.find(actual => actual.idCita === idCita);
        if (!cita) {
            showToast('No se encontró la cita para enviar el recordatorio.', 'danger');
            return false;
        }
        if (!currentUser?.accessToken) {
            showToast('La sesión expiró; vuelva a iniciar sesión para enviar recordatorios.', 'danger');
            return false;
        }
        try {
            await enviarRecordatorioCita(idCita, canal, currentUser.accessToken);
            const canalNombre = canal === 'correo'
                ? 'correo'
                : canal === 'whatsapp' ? 'WhatsApp' : 'SMS';
            showToast(`Recordatorio enviado por ${canalNombre}.`, 'success');
            return true;
        } catch (error) {
            showToast(error.message, 'danger');
            return false;
        }
    }

    async function cancelarCita(idCita) {
        try {
            const citaApi = await cancelarCitaApi(idCita, currentUser?.accessToken);
            const citaActualizada = mapCita(citaApi);
            setCitasGlobales(prev => prev.map(cita =>
                cita.idCita === citaActualizada.idCita ? citaActualizada : cita
            ));
            showToast('Cita cancelada correctamente.', 'success');
            return true;
        } catch (error) {
            showToast(error.message, 'danger');
            return false;
        }
    }

    async function guardarParte(citaId, datosParteMedico) {
        const cita = citasGlobales.find(actual => actual.idCita === citaId);
        if (!cita) {
            showToast('La cita no existe en el API.', 'danger');
            return false;
        }
        if (!puedeGenerarParteMedico(cita)) {
            showToast('No se puede crear el parte médico antes de la fecha y hora programada de la cita.', 'danger');
            return false;
        }

        try {
            const parteApi = await guardarParteMedicoApi(citaId, {
                diagnostico: datosParteMedico.diagnostico,
                evolucion: datosParteMedico.evolucion,
                medicamentos: datosParteMedico.medicamentos,
                medicoId: cita.medicoApiId
            }, currentUser?.accessToken);
            const parte = mapParte(parteApi);
            setHistorialesClinicos(prev => ({
                ...prev,
                [cita.pacienteId]: [
                    ...(prev[cita.pacienteId] || []).filter(actual => actual.citaId !== citaId),
                    parte
                ]
            }));
            setCitasGlobales(prev => prev.map(actual =>
                actual.idCita === citaId ? { ...actual, estado: 'Terminada' } : actual
            ));
            showToast('Parte médico guardado correctamente en el HCE.', 'success');
            return true;
        } catch (error) {
            showToast(error.message, 'danger');
            return false;
        }
    }

    function obtenerPacientePorId(pacienteId) {
        return usuariosRegistrados.find(usuario => usuario.id === pacienteId);
    }

    function obtenerAgendaPorFecha(fecha) {
        return citasPorFecha[fecha] || [];
    }

    const value = {
        usuariosRegistrados,
        medicos,
        especialidades,
        citasGlobales,
        citasPorFecha,
        historialesClinicos,
        currentUser,
        registrarPaciente,
        login,
        logout,
        agendarCita,
        enviarRecordatorio,
        cancelarCita,
        guardarParteMedico: guardarParte,
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
