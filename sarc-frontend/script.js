// ================= BASE DE DATOS Y ESTRUCTURAS INICIALES =================

const RECEPCIONISTA = { nombre: "Carlos Andres Medina", id: "1116543809", tipo: "recepcionista" };

const MEDICOS = [
    { nombre: "Alejandro Torres Rojas", id: "1012456781", especialidad: "Medicina General" },
    { nombre: "Carolina Méndez Ruiz", id: "1009876542", especialidad: "Medicina General" },
    { nombre: "Julián Herrera Castro", id: "1034567890", especialidad: "Medicina General" },
    { nombre: "Andrés Salazar Gómez", id: "1023456712", especialidad: "Cirugía General" },
    { nombre: "Natalia Pardo León", id: "1018765439", especialidad: "Cirugía General" },
    { nombre: "Felipe Cárdenas Ríos", id: "1045678913", especialidad: "Cirugía General" },
    { nombre: "Laura Sánchez Molina", id: "1004567821", especialidad: "Pediatría" },
    { nombre: "Sebastián Ortiz Vargas", id: "1021987654", especialidad: "Pediatría" },
    { nombre: "Diana Ramírez Silva", id: "1038765412", especialidad: "Pediatría" },
    { nombre: "Camilo Gutiérrez Pérez", id: "1013345678", especialidad: "Odontología" },
    { nombre: "Valentina Moreno Díaz", id: "1025567891", especialidad: "Odontología" },
    { nombre: "Nicolás Acosta Beltrán", id: "1041123456", especialidad: "Odontología" },
    { nombre: "Ricardo Fernández Muñoz", id: "1009988776", especialidad: "Neurocirugía" },
    { nombre: "Marcela Jiménez Castillo", id: "1022233445", especialidad: "Neurocirugía" },
    { nombre: "Esteban Lozano Quintero", id: "1034455667", especialidad: "Neurocirugía" }
];

const BLOQUES_HORARIOS = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
let citasGlobales = JSON.parse(localStorage.getItem('citasGlobales')) || [];
let historialesClinicos = JSON.parse(localStorage.getItem('historialesClinicos')) || {};
let currentUser = null;

// ================= CONTROL DE FLUJO VISTA (LOGIN/TABS) =================

function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    if (tab === 'login') {
        document.getElementById('tab-login').classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else {
        document.getElementById('tab-register').classList.add('active');
        document.getElementById('register-form').classList.add('active');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const nombre = document.getElementById('reg-name').value.trim();
    const id = document.getElementById('reg-id').value.trim();
    const fechaNacimiento = document.getElementById('reg-dob').value;
    const regimen = document.getElementById('reg-regimen').value;

    if (usuariosRegistrados.some(u => u.id === id)) {
        showToast("Este número de identificación ya está registrado.", "danger");
        return;
    }

    usuariosRegistrados.push({ nombre, id, fechaNacimiento, regimen, tipo: 'paciente' });
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));

    showToast("Registro exitoso. Proceda a iniciar sesión.", "success");
    document.getElementById('register-form').reset();
    switchAuthTab('login');
}

function handleLogin(event) {
    event.preventDefault();
    const nombre = document.getElementById('login-name').value.trim();
    const id = document.getElementById('login-id').value.trim();

    if (nombre === RECEPCIONISTA.nombre && id === RECEPCIONISTA.id) {
        currentUser = RECEPCIONISTA;
        launchPanel('panel-recepcionista');
        renderRecepcionistaPanel();
        return;
    }

    const medicoEncontrado = MEDICOS.find(m => m.nombre.toLowerCase() === nombre.toLowerCase() && m.id === id);
    if (medicoEncontrado) {
        currentUser = { ...medicoEncontrado, tipo: 'medico' };
        launchPanel('panel-medico');
        renderMedicoPanel();
        return;
    }

    const pacienteEncontrado = usuariosRegistrados.find(u => u.nombre.toLowerCase() === nombre.toLowerCase() && u.id === id);
    if (pacienteEncontrado) {
        currentUser = pacienteEncontrado;
        launchPanel('panel-paciente');
        renderPacientePanel();
        return;
    }

    showToast("Credenciales no encontradas. Verifique datos o regístrese.", "danger");
}

function launchPanel(panelId) {
    document.getElementById('auth-section').style.display = 'none';
    document.querySelectorAll('.role-panel').forEach(p => p.style.display = 'none');
    document.getElementById(panelId).style.display = 'block';
    showToast(`Bienvenido(a) al sistema, ${currentUser.nombre}`, "success");
    if (typeof showWelcome === 'function') {
        showWelcome(currentUser.nombre);
    }
}

function logout() {
    currentUser = null;
    document.getElementById('panel-paciente').style.display = 'none';
    document.getElementById('panel-recepcionista').style.display = 'none';
    document.getElementById('panel-medico').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('login-form').reset();
    showToast("Sesión cerrada correctamente.", "success");
}

// ================= UTILIDADES =================

function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function obtenerPacientePorId(pacienteId) {
    return usuariosRegistrados.find(u => u.id === pacienteId);
}

// Convertir imagen URL a Base64
function getBase64ImageFromUrl(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
    });
}

// ================= OPERACIONES ROL: PACIENTE =================

function renderPacientePanel() {
    document.getElementById('paciente-display-name').innerText = currentUser.nombre;
    document.getElementById('paciente-display-regimen').innerText = `Régimen: ${currentUser.regimen}`;
    document.getElementById('book-name').value = currentUser.nombre;
    document.getElementById('book-id').value = currentUser.id;

    document.getElementById('book-specialty').selectedIndex = 0;
    updateDoctorsAndAgenda();
    renderPacienteTable();
}

function updateDoctorsAndAgenda() {
    const specialty = document.getElementById('book-specialty').value;
    const docSelect = document.getElementById('book-doctor');

    docSelect.innerHTML = '<option value="" disabled selected>Seleccione un profesional...</option>';

    if (!specialty) {
        docSelect.disabled = true;
        return;
    }

    const medicosFiltrados = MEDICOS.filter(m => m.especialidad === specialty);
    medicosFiltrados.forEach(m => {
        let opt = document.createElement('option');
        opt.value = m.id;
        opt.innerText = m.nombre;
        docSelect.appendChild(opt);
    });

    docSelect.disabled = false;
    updateAvailableTimes();
}

function updateAvailableTimes() {
    const medicoId = document.getElementById('book-doctor').value;
    const fecha = document.getElementById('book-date').value;
    const timeSelect = document.getElementById('book-time');

    timeSelect.innerHTML = '<option value="" disabled selected>Seleccione la hora...</option>';

    if (!medicoId || !fecha) {
        timeSelect.disabled = true;
        return;
    }

    const horasOcupadas = citasGlobales
        .filter(c => c.medicoId === medicoId && c.fecha === fecha && c.estado === 'Confirmada')
        .map(c => c.hora);

    let disponibles = 0;
    BLOQUES_HORARIOS.forEach(hora => {
        if (!horasOcupadas.includes(hora)) {
            let opt = document.createElement('option');
            opt.value = hora;
            opt.innerText = hora;
            timeSelect.appendChild(opt);
            disponibles++;
        }
    });

    if(disponibles === 0) {
        timeSelect.innerHTML = '<option value="" disabled>No hay agendas disponibles hoy</option>';
    }

    timeSelect.disabled = false;
}

function handleBooking(event) {
    event.preventDefault();

    const medicoId = document.getElementById('book-doctor').value;
    const medicoObj = MEDICOS.find(m => m.id === medicoId);
    const fecha = document.getElementById('book-date').value;
    const hora = document.getElementById('book-time').value;

    const nuevaCita = {
        idCita: 'CITA-' + Date.now(),
        pacienteNombre: currentUser.nombre,
        pacienteId: currentUser.id,
        celular: document.getElementById('book-phone').value,
        correo: document.getElementById('book-email').value,
        especialidad: document.getElementById('book-specialty').value,
        medicoNombre: medicoObj.nombre,
        medicoId: medicoId,
        fecha: fecha,
        hora: hora,
        estado: 'Confirmada'
    };

    citasGlobales.push(nuevaCita);
    localStorage.setItem('citasGlobales', JSON.stringify(citasGlobales));

    showToast("Cita agendada correctamente.", "success");
    document.getElementById('booking-form').reset();
    renderPacientePanel();
}

function renderPacienteTable() {
    const tbody = document.querySelector('#table-paciente-citas tbody');
    tbody.innerHTML = '';

    const misCitas = citasGlobales.filter(c => c.pacienteId === currentUser.id);

    if(misCitas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No registra citas médicas activas.</td></tr>';
        return;
    }

    misCitas.forEach(c => {
        const historial = historialesClinicos[c.pacienteId] || [];
        const tieneParte = historial.some(h => h.citaId === c.idCita);

        let acciones = '';
        if (tieneParte) {
            acciones = `<button class="btn-action-notify" onclick="descargarPDFPartePaciente('${c.idCita}')">Descargar Parte PDF</button>`;
        } else {
            acciones = `<em style="color:var(--text-muted);font-size:0.8rem;">Pendiente por atención</em>`;
        }

        let row = `<tr>
            <td>${c.medicoNombre}</td>
            <td>${c.especialidad}</td>
            <td>${c.fecha} - ${c.hora}</td>
            <td><span class="status-badge ${c.estado.toLowerCase()}">${c.estado}</span></td>
            <td>${acciones}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function descargarPDFPartePaciente(citaId) {
    const cita = citasGlobales.find(c => c.idCita === citaId);
    if (!cita) return;

    const paciente = obtenerPacientePorId(cita.pacienteId);
    const edad = paciente && paciente.fechaNacimiento ? calcularEdad(paciente.fechaNacimiento) : 'N/A';
    const historial = historialesClinicos[cita.pacienteId] || [];
    const parte = historial.find(h => h.citaId === citaId);

    if (!parte) {
        showToast("No se encontró parte médico para esta cita.", "danger");
        return;
    }

    generarPDFParte(cita, parte, edad, parte.medicoNombre, parte.medicoId);
}

function descargarMiHistorialPDF() {
    const paciente = currentUser;
    const edad = paciente.fechaNacimiento ? calcularEdad(paciente.fechaNacimiento) : 'N/A';
    const historial = historialesClinicos[paciente.id] || [];

    generarPDFHistorial(paciente.nombre, paciente.id, edad, historial);
}

// ================= OPERACIONES ROL: RECEPCIONISTA =================

function renderRecepcionistaPanel() {
    const tbody = document.querySelector('#table-recep-citas tbody');
    tbody.innerHTML = '';

    if (citasGlobales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay citas registradas en el ecosistema.</td></tr>';
        return;
    }

    citasGlobales.forEach(c => {
        let acciones = '';
        if (c.estado === 'Confirmada') {
            acciones = `
                <button class="btn-action-notify" onclick="enviarRecordatorio('${c.idCita}')">Notificar</button>
                <button class="btn-action-cancel" onclick="cancelarCita('${c.idCita}')">Cancelar</button>
            `;
        } else {
            acciones = `<em style="color:var(--text-muted);">Sin acciones</em>`;
        }

        let row = `<tr>
            <td><strong>${c.pacienteNombre}</strong></td>
            <td>${c.pacienteId}</td>
            <td>${c.medicoNombre}</td>
            <td>${c.especialidad}</td>
            <td>${c.fecha} (${c.hora})</td>
            <td><span class="status-badge ${c.estado.toLowerCase()}">${c.estado}</span></td>
            <td>${acciones}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function enviarRecordatorio(idCita) {
    const cita = citasGlobales.find(c => c.idCita === idCita);
    showToast(`Recordatorio enviado a ${cita.pacienteNombre} vía WhatsApp/SMS (${cita.celular}) y Correo electrónico (${cita.correo}).`, "success");
}

function cancelarCita(idCita) {
    if(confirm("¿Está seguro de que desea cancelar esta cita debido a cambios imprevistos en la agenda del especialista?")) {
        const cita = citasGlobales.find(c => c.idCita === idCita);
        cita.estado = 'Cancelada';
        localStorage.setItem('citasGlobales', JSON.stringify(citasGlobales));

        alert(`NOTIFICACIÓN ENVIADA AUTOMÁTICAMENTE:

Estimado(a) ${cita.pacienteNombre},
Le informamos que su cita de ${cita.especialidad} programada para el día ${cita.fecha} a las ${cita.hora} ha sido CANCELADA debido a cambios en la agenda del Médico ${cita.medicoNombre}.

Por favor, reingrese al sistema SARC para realizar un nuevo agendamiento.`);

        showToast("Cita cancelada y correo de notificación despachado.", "danger");
        renderRecepcionistaPanel();
    }
}

// ================= OPERACIONES ROL: MÉDICO =================

function renderMedicoPanel() {
    document.getElementById('medico-display-name').innerText = `${currentUser.nombre} (${currentUser.especialidad})`;
    const tbody = document.querySelector('#table-medico-citas tbody');
    tbody.innerHTML = '';

    BLOQUES_HORARIOS.forEach(hora => {
        const citaAsignada = citasGlobales.find(c => c.medicoId === currentUser.id && c.hora === hora && c.estado === 'Confirmada');

        let row = '';
        if(citaAsignada) {
            const historial = historialesClinicos[citaAsignada.pacienteId] || [];
            const tieneParte = historial.some(h => h.citaId === citaAsignada.idCita);
            const estadoTexto = tieneParte ? 'Ocupado (Parte listo)' : 'Ocupado';
            const badgeClass = tieneParte ? 'confirmada parte-listo' : 'confirmada';

            row = `<tr class="fila-cita-ocupada" style="background: rgba(46, 204, 113, 0.08); cursor: pointer;" onclick="abrirHCE('${citaAsignada.idCita}')">
                <td><strong>${hora}</strong></td>
                <td>${citaAsignada.pacienteNombre}</td>
                <td>${citaAsignada.pacienteId}</td>
                <td>${citaAsignada.celular} / ${citaAsignada.correo}</td>
                <td><span class="status-badge ${badgeClass}">${estadoTexto}</span></td>
            </tr>`;
        } else {
            row = `<tr>
                <td><span style="color:var(--text-muted);">${hora}</span></td>
                <td colspan="3" style="color: #27ae60; font-style: italic;">Disponible para Agendamiento</td>
                <td><span class="status-badge" style="background:#e8f4f8; color:#2980b9;">Libre</span></td>
            </tr>`;
        }
        tbody.innerHTML += row;
    });
}

// ================= SUBSISTEMA HCE - HISTORIA CLÍNICA ELECTRÓNICA =================

function abrirHCE(citaId) {
    const cita = citasGlobales.find(c => c.idCita === citaId);
    if (!cita) return;

    const paciente = obtenerPacientePorId(cita.pacienteId);
    const edad = paciente && paciente.fechaNacimiento ? calcularEdad(paciente.fechaNacimiento) : 'No registrada';

    document.getElementById('hce-cita-id').value = citaId;
    document.getElementById('hce-paciente-info').innerHTML = `
        <strong>Institución:</strong> P&G Servicios Médicos | 
        <strong>Paciente:</strong> ${cita.pacienteNombre} | 
        <strong>ID:</strong> ${cita.pacienteId} | 
        <strong>Edad:</strong> ${edad} años | 
        <strong>Fecha Atención:</strong> ${cita.fecha} ${cita.hora} | 
        <strong>Médico:</strong> ${currentUser.nombre} (ID: ${currentUser.id})
    `;

    const historial = historialesClinicos[cita.pacienteId] || [];
    const parteExistente = historial.find(h => h.citaId === citaId);

    document.getElementById('hce-diagnostico').value = parteExistente ? parteExistente.diagnostico : '';
    document.getElementById('hce-evolucion').value = parteExistente ? parteExistente.evolucion : '';

    const tbody = document.querySelector('#hce-meds-table tbody');
    tbody.innerHTML = '';
    if (parteExistente && parteExistente.medicamentos && parteExistente.medicamentos.length > 0) {
        parteExistente.medicamentos.forEach(med => agregarFilaMedicamento(med.nombre, med.cantidad));
    } else {
        agregarFilaMedicamento();
    }

    document.getElementById('hce-modal').style.display = 'flex';
}

function cerrarHCE() {
    document.getElementById('hce-modal').style.display = 'none';
    document.getElementById('hce-form').reset();
    document.querySelector('#hce-meds-table tbody').innerHTML = '';
}

function agregarFilaMedicamento(nombre = '', cantidad = '') {
    const tbody = document.querySelector('#hce-meds-table tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="med-nombre" value="${nombre}" placeholder="Nombre del medicamento" required></td>
        <td><input type="text" class="med-cantidad" value="${cantidad}" placeholder="Ej: 1 caja / 10 mg" required></td>
        <td><button type="button" class="btn-action-cancel" onclick="this.closest('tr').remove()" style="padding:4px 8px;font-size:0.8rem;">✕</button></td>
    `;
    tbody.appendChild(tr);
}

function guardarParteMedico(event) {
    event.preventDefault();
    const citaId = document.getElementById('hce-cita-id').value;
    const cita = citasGlobales.find(c => c.idCita === citaId);
    if (!cita) return;

    const medicamentos = [];
    document.querySelectorAll('#hce-meds-table tbody tr').forEach(row => {
        const nombre = row.querySelector('.med-nombre').value.trim();
        const cantidad = row.querySelector('.med-cantidad').value.trim();
        if (nombre && cantidad) medicamentos.push({ nombre, cantidad });
    });

    const parteMedico = {
        citaId: citaId,
        fechaAtencion: cita.fecha,
        horaAtencion: cita.hora,
        fechaEmision: new Date().toLocaleString('es-CO'),
        medicoNombre: currentUser.nombre,
        medicoId: currentUser.id,
        diagnostico: document.getElementById('hce-diagnostico').value.trim(),
        evolucion: document.getElementById('hce-evolucion').value.trim(),
        medicamentos: medicamentos
    };

    if (!historialesClinicos[cita.pacienteId]) {
        historialesClinicos[cita.pacienteId] = [];
    }

    const idx = historialesClinicos[cita.pacienteId].findIndex(h => h.citaId === citaId);
    if (idx >= 0) {
        historialesClinicos[cita.pacienteId][idx] = parteMedico;
    } else {
        historialesClinicos[cita.pacienteId].push(parteMedico);
    }

    localStorage.setItem('historialesClinicos', JSON.stringify(historialesClinicos));
    showToast('Parte médico guardado correctamente en el HCE.', 'success');
    cerrarHCE();
    renderMedicoPanel();
}

// ================= GENERACIÓN DE PDFs =================

function generarPDFParteMedico() {
    const citaId = document.getElementById('hce-cita-id').value;
    const cita = citasGlobales.find(c => c.idCita === citaId);
    if (!cita) return;

    const paciente = obtenerPacientePorId(cita.pacienteId);
    const edad = paciente && paciente.fechaNacimiento ? calcularEdad(paciente.fechaNacimiento) : 'N/A';
    const historial = historialesClinicos[cita.pacienteId] || [];
    const parte = historial.find(h => h.citaId === citaId);

    if (!parte) {
        showToast("Primero guarde el parte médico antes de generar el PDF.", "danger");
        return;
    }

    generarPDFParte(cita, parte, edad, currentUser.nombre, currentUser.id);
}

function generarPDFHistorialDesdeMedico() {
    const citaId = document.getElementById('hce-cita-id').value;
    const cita = citasGlobales.find(c => c.idCita === citaId);
    if (!cita) return;

    const paciente = obtenerPacientePorId(cita.pacienteId);
    const edad = paciente && paciente.fechaNacimiento ? calcularEdad(paciente.fechaNacimiento) : 'N/A';
    const historial = historialesClinicos[cita.pacienteId] || [];

    generarPDFHistorial(cita.pacienteNombre, cita.pacienteId, edad, historial);
}

// Función central para generar PDF de un parte médico específico
async function generarPDFParte(cita, parte, edad, medicoNombre, medicoId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cargar e insertar logo en Base64
    try {
        const logoBase64 = await getBase64ImageFromUrl('png/Logo P&G.png');
        doc.addImage(logoBase64, 'PNG', 14, 8, 28, 28);
    } catch (e) {
        console.warn('No fue posible cargar el logo en el PDF (parte médico):', e);
    }

    // Encabezado institucional
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('P&G SERVICIOS MEDICOS', 105, 22, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('HISTORIA CLINICA ELECTRONICA - PARTE MEDICO', 105, 30, { align: 'center' });

    // Línea separadora
    doc.setDrawColor(41, 128, 185);
    doc.line(14, 38, 196, 38);

    // Datos del centro y profesional
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL CENTRO Y PROFESIONAL', 14, 46);
    doc.setFont(undefined, 'normal');
    doc.text(`Institucion de Salud: P&G Servicios Medicos`, 14, 52);
    doc.text(`Nombre del Medico: ${medicoNombre}`, 14, 58);
    doc.text(`No. Identidad Medico: ${medicoId}`, 14, 64);

    // Datos del paciente
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL PACIENTE', 120, 46);
    doc.setFont(undefined, 'normal');
    doc.text(`Nombre Completo: ${cita.pacienteNombre}`, 120, 52);
    doc.text(`No. Identificacion (Cedula): ${cita.pacienteId}`, 120, 58);
    doc.text(`Edad: ${edad} anos`, 120, 64);

    // Fecha y hora
    doc.setFont(undefined, 'bold');
    doc.text('FECHA Y HORA DE ATENCION', 14, 74);
    doc.setFont(undefined, 'normal');
    doc.text(`Fecha de emision del parte: ${parte.fechaEmision}`, 14, 80);
    doc.text(`Fecha de atencion brindada: ${parte.fechaAtencion}`, 14, 86);
    doc.text(`Hora de atencion brindada: ${parte.horaAtencion}`, 120, 86);

    doc.line(14, 90, 196, 90);

    // Diagnóstico
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('DIAGNOSTICO:', 14, 98);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const splitDiag = doc.splitTextToSize(parte.diagnostico, 180);
    doc.text(splitDiag, 14, 104);

    let yPos = 104 + (splitDiag.length * 5);

    // Evolución / Pronóstico
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('EVOLUCION / PRONOSTICO:', 14, yPos + 4);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const splitEvol = doc.splitTextToSize(parte.evolucion, 180);
    doc.text(splitEvol, 14, yPos + 10);

    yPos = yPos + 10 + (splitEvol.length * 5);

    // Medicamentos
    if (parte.medicamentos && parte.medicamentos.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.text('MEDICAMENTOS FORMULADOS:', 14, yPos + 4);

        const body = parte.medicamentos.map(m => [m.nombre, m.cantidad]);
        doc.autoTable({
            startY: yPos + 8,
            head: [['Nombre del Medicamento', 'Cantidad']],
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 3 },
            margin: { left: 14, right: 14 }
        });

        yPos = doc.lastAutoTable.finalY;
    } else {
        doc.setFont(undefined, 'italic');
        doc.setFontSize(10);
        doc.text('No se formularon medicamentos.', 14, yPos + 8);
        doc.setFont(undefined, 'normal');
        yPos += 12;
    }

    // Firma
    yPos += 20;
    doc.line(80, yPos, 130, yPos);
    doc.setFontSize(10);
    doc.text(`Firma y Sello: ${medicoNombre}`, 105, yPos + 6, { align: 'center' });

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Documento generado por SARC - Sistema de Agendamiento, Recordatorio y Cancelacion de Citas', 105, 285, { align: 'center' });

    doc.save(`Parte_Medico_${cita.pacienteNombre}_${parte.fechaAtencion}.pdf`);
}

// Función central para generar PDF del historial clínico completo
async function generarPDFHistorial(nombrePaciente, idPaciente, edad, historial) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cargar e insertar logo en Base64
    try {
        const logoBase64 = await getBase64ImageFromUrl('png/Logo P&G.png');
        doc.addImage(logoBase64, 'PNG', 14, 8, 28, 28);
    } catch (e) {
        console.warn('No fue posible cargar el logo en el PDF (historial clínico):', e);
    }

    // Encabezado
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('P&G SERVICIOS MEDICOS', 105, 22, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('HISTORIAL CLINICO ELECTRONICO', 105, 30, { align: 'center' });

    doc.setDrawColor(41, 128, 185);
    doc.line(14, 38, 196, 38);

    // Datos del paciente
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL PACIENTE', 14, 46);
    doc.setFont(undefined, 'normal');
    doc.text(`Nombre Completo: ${nombrePaciente}`, 14, 52);
    doc.text(`No. Identificacion (Cedula): ${idPaciente}`, 14, 58);
    doc.text(`Edad: ${edad} anos`, 14, 64);
    doc.text(`Total de atenciones registradas: ${historial.length}`, 14, 70);

    doc.line(14, 74, 196, 74);

    let yPos = 82;

    if (historial.length === 0) {
        doc.setFontSize(11);
        doc.setTextColor(150, 150, 150);
        doc.text('El paciente no registra atenciones medicas previas en el sistema.', 14, yPos);
    } else {
        historial.forEach((parte, index) => {
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }

            // Encabezado de atención
            doc.setFillColor(240, 248, 255);
            doc.rect(14, yPos - 4, 182, 8, 'F');
            doc.setFontSize(11);
            doc.setTextColor(41, 128, 185);
            doc.setFont(undefined, 'bold');
            doc.text(`Atencion #${index + 1} - ${parte.fechaAtencion} | ${parte.horaAtencion}`, 16, yPos);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');

            doc.setFontSize(9);
            doc.text(`Medico: ${parte.medicoNombre} (ID: ${parte.medicoId})`, 14, yPos + 8);
            doc.text(`Emision parte: ${parte.fechaEmision}`, 120, yPos + 8);

            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text('Diagnostico:', 14, yPos + 16);
            doc.setFont(undefined, 'normal');
            const splitDiag = doc.splitTextToSize(parte.diagnostico, 180);
            doc.text(splitDiag, 14, yPos + 21);

            let innerY = yPos + 21 + (splitDiag.length * 4);

            doc.setFont(undefined, 'bold');
            doc.text('Evolucion / Pronostico:', 14, innerY + 2);
            doc.setFont(undefined, 'normal');
            const splitEvol = doc.splitTextToSize(parte.evolucion, 180);
            doc.text(splitEvol, 14, innerY + 7);

            innerY = innerY + 7 + (splitEvol.length * 4);

            if (parte.medicamentos && parte.medicamentos.length > 0) {
                doc.autoTable({
                    startY: innerY + 2,
                    head: [['Medicamento', 'Cantidad']],
                    body: parte.medicamentos.map(m => [m.nombre, m.cantidad]),
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                    styles: { fontSize: 9, cellPadding: 2 },
                    margin: { left: 14, right: 14 }
                });
                yPos = doc.lastAutoTable.finalY + 10;
            } else {
                doc.setFontSize(9);
                doc.setFont(undefined, 'italic');
                doc.text('Sin medicamentos formulados.', 14, innerY + 6);
                doc.setFont(undefined, 'normal');
                yPos = innerY + 12;
            }
        });
    }

    // Pie de página en todas las páginas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Documento generado por SARC - Pagina ${i} de ${pageCount}`, 105, 285, { align: 'center' });
    }

    doc.save(`Historial_Clinico_${nombrePaciente}.pdf`);
}

// ================= NOTIFICACIONES GENERALES DEL SISTEMA =================

function showWelcome(name) {
    const overlay = document.getElementById('welcome-overlay');
    if (!overlay) return;
    const nameEl = document.getElementById('welcome-name');
    const roleEl = document.getElementById('welcome-role');

    nameEl.innerText = name || '';
    roleEl.innerText = currentUser && currentUser.tipo ? (currentUser.tipo.charAt(0).toUpperCase() + currentUser.tipo.slice(1)) : '';

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    overlay.querySelector('.welcome-card').classList.add('visible');

    setTimeout(() => {
        overlay.querySelector('.welcome-card').classList.remove('visible');
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
    }, 3000);
}

function showToast(message, type = "info") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}