import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getBase64ImageFromUrl } from './helpers';

// Genera el PDF de un parte médico específico
export async function generarPDFParte(cita, parte, edad, medicoNombre, medicoId) {
    const doc = new jsPDF();

    try {
        const logoBase64 = await getBase64ImageFromUrl('/img/Logo_PG.png');
        doc.addImage(logoBase64, 'PNG', 14, 8, 28, 28);
    } catch (e) {
        console.warn('No fue posible cargar el logo en el PDF (parte médico):', e);
    }

    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('P&G SERVICIOS MEDICOS', 105, 22, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('HISTORIA CLINICA ELECTRONICA - PARTE MEDICO', 105, 30, { align: 'center' });

    doc.setDrawColor(41, 128, 185);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL CENTRO Y PROFESIONAL', 14, 46);
    doc.setFont(undefined, 'normal');
    doc.text(`Institucion de Salud: P&G Servicios Medicos`, 14, 52);
    doc.text(`Nombre del Medico: ${medicoNombre}`, 14, 58);
    doc.text(`No. Identidad Medico: ${medicoId}`, 14, 64);

    doc.setFont(undefined, 'bold');
    doc.text('DATOS DEL PACIENTE', 120, 46);
    doc.setFont(undefined, 'normal');
    doc.text(`Nombre Completo: ${cita.pacienteNombre}`, 120, 52);
    doc.text(`No. Identificacion (Cedula): ${cita.pacienteId}`, 120, 58);
    doc.text(`Edad: ${edad} anos`, 120, 64);

    doc.setFont(undefined, 'bold');
    doc.text('FECHA Y HORA DE ATENCION', 14, 74);
    doc.setFont(undefined, 'normal');
    doc.text(`Fecha de emision del parte: ${parte.fechaEmision}`, 14, 80);
    doc.text(`Fecha de atencion brindada: ${parte.fechaAtencion}`, 14, 86);
    doc.text(`Hora de atencion brindada: ${parte.horaAtencion}`, 120, 86);

    doc.line(14, 90, 196, 90);

    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('DIAGNOSTICO:', 14, 98);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const splitDiag = doc.splitTextToSize(parte.diagnostico, 180);
    doc.text(splitDiag, 14, 104);

    let yPos = 104 + (splitDiag.length * 5);

    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('EVOLUCION / PRONOSTICO:', 14, yPos + 4);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const splitEvol = doc.splitTextToSize(parte.evolucion, 180);
    doc.text(splitEvol, 14, yPos + 10);

    yPos = yPos + 10 + (splitEvol.length * 5);

    if (parte.medicamentos && parte.medicamentos.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.text('MEDICAMENTOS FORMULADOS:', 14, yPos + 4);

        const body = parte.medicamentos.map(m => [m.nombre, m.cantidad]);
        autoTable(doc, {
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

    yPos += 20;
    doc.line(80, yPos, 130, yPos);
    doc.setFontSize(10);
    doc.text(`Firma y Sello: ${medicoNombre}`, 105, yPos + 6, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Documento generado por SARC - Sistema de Agendamiento, Recordatorio y Cancelacion de Citas', 105, 285, { align: 'center' });

    doc.save(`Parte_Medico_${cita.pacienteNombre}_${parte.fechaAtencion}.pdf`);
}

// Genera el PDF del historial clínico completo
export async function generarPDFHistorial(nombrePaciente, idPaciente, edad, historial) {
    const doc = new jsPDF();

    try {
        const logoBase64 = await getBase64ImageFromUrl('/img/Logo_PG.png');
        doc.addImage(logoBase64, 'PNG', 14, 8, 28, 28);
    } catch (e) {
        console.warn('No fue posible cargar el logo en el PDF (historial clínico):', e);
    }

    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('P&G SERVICIOS MEDICOS', 105, 22, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('HISTORIAL CLINICO ELECTRONICO', 105, 30, { align: 'center' });

    doc.setDrawColor(41, 128, 185);
    doc.line(14, 38, 196, 38);

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
                autoTable(doc, {
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

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Documento generado por SARC - Pagina ${i} de ${pageCount}`, 105, 285, { align: 'center' });
    }

    doc.save(`Historial_Clinico_${nombrePaciente}.pdf`);
}
