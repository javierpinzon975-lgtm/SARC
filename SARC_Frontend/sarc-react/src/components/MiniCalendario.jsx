import { useMemo, useState } from 'react';

const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const nombresDias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function fechaDesdeISO(fecha) {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
}

function fechaAISO(fecha) {
    return [
        fecha.getFullYear(),
        String(fecha.getMonth() + 1).padStart(2, '0'),
        String(fecha.getDate()).padStart(2, '0')
    ].join('-');
}

export default function MiniCalendario({ fechaSeleccionada, onChange }) {
    const fechaInicial = fechaDesdeISO(fechaSeleccionada);
    const [mesVisible, setMesVisible] = useState(
        new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), 1)
    );

    const dias = useMemo(() => {
        const primerDia = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1);
        const ultimoDia = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0);
        const primerDiaDeSemana = (primerDia.getDay() + 6) % 7;
        const totalCeldas = Math.ceil((primerDiaDeSemana + ultimoDia.getDate()) / 7) * 7;

        return Array.from({ length: totalCeldas }, (_, indice) => {
            const dia = indice - primerDiaDeSemana + 1;
            if (dia < 1 || dia > ultimoDia.getDate()) return null;
            return new Date(mesVisible.getFullYear(), mesVisible.getMonth(), dia);
        });
    }, [mesVisible]);

    function cambiarMes(desplazamiento) {
        setMesVisible(prev => new Date(prev.getFullYear(), prev.getMonth() + desplazamiento, 1));
    }

    return (
        <div className="mini-calendar" aria-label="Calendario para seleccionar fecha">
            <div className="mini-calendar-header">
                <button type="button" onClick={() => cambiarMes(-1)} aria-label="Mes anterior">‹</button>
                <strong>{nombresMeses[mesVisible.getMonth()]} {mesVisible.getFullYear()}</strong>
                <button type="button" onClick={() => cambiarMes(1)} aria-label="Mes siguiente">›</button>
            </div>
            <div className="mini-calendar-weekdays" aria-hidden="true">
                {nombresDias.map(dia => <span key={dia}>{dia}</span>)}
            </div>
            <div className="mini-calendar-days">
                {dias.map((dia, indice) => {
                    if (!dia) return <span className="mini-calendar-empty" key={`empty-${indice}`} />;

                    const iso = fechaAISO(dia);
                    const seleccionado = iso === fechaSeleccionada;
                    return (
                        <button
                            type="button"
                            className={seleccionado ? 'selected' : ''}
                            key={iso}
                            aria-label={`Seleccionar ${dia.getDate()} de ${nombresMeses[dia.getMonth()]}`}
                            aria-pressed={seleccionado}
                            onClick={() => onChange(iso)}
                        >
                            {dia.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
