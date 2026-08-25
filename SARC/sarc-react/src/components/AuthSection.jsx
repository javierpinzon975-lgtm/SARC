import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthSection() {
    const [tab, setTab] = useState('login');
    const { login, registrarPaciente } = useApp();

    const [loginData, setLoginData] = useState({ nombre: '', id: '' });
    const [regData, setRegData] = useState({ nombre: '', id: '', fechaNacimiento: '', regimen: '' });

    function handleLogin(e) {
        e.preventDefault();
        login({ nombre: loginData.nombre.trim(), id: loginData.id.trim() });
    }

    function handleRegister(e) {
        e.preventDefault();
        const ok = registrarPaciente({
            nombre: regData.nombre.trim(),
            id: regData.id.trim(),
            fechaNacimiento: regData.fechaNacimiento,
            regimen: regData.regimen
        });
        if (ok) {
            setRegData({ nombre: '', id: '', fechaNacimiento: '', regimen: '' });
            setTab('login');
        }
    }

    return (
        <section id="auth-section" className="glass-card">
            <div className="tabs">
                <button
                    className={`tab-btn${tab === 'login' ? ' active' : ''}`}
                    onClick={() => setTab('login')}
                    type="button"
                >
                    Iniciar Sesión
                </button>
                <button
                    className={`tab-btn${tab === 'register' ? ' active' : ''}`}
                    onClick={() => setTab('register')}
                    type="button"
                >
                    Registrarse (Paciente)
                </button>
            </div>

            <form className={`auth-form${tab === 'login' ? ' active' : ''}`} onSubmit={handleLogin}>
                <h3>Ingreso al Sistema</h3>
                <div className="form-group">
                    <label htmlFor="login-name">Nombre Completo</label>
                    <input
                        type="text" id="login-name" required autoComplete="off"
                        value={loginData.nombre}
                        onChange={e => setLoginData({ ...loginData, nombre: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="login-id">Número de Identificación</label>
                    <input
                        type="text" id="login-id" required autoComplete="off"
                        value={loginData.id}
                        onChange={e => setLoginData({ ...loginData, id: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn-primary">Acceder al Sistema</button>
            </form>

            <form className={`auth-form${tab === 'register' ? ' active' : ''}`} onSubmit={handleRegister}>
                <h3>Registro de Paciente Nuevo</h3>
                <div className="form-group">
                    <label htmlFor="reg-name">Nombre Completo</label>
                    <input
                        type="text" id="reg-name" required autoComplete="off"
                        value={regData.nombre}
                        onChange={e => setRegData({ ...regData, nombre: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-id">Número de Identificación</label>
                    <input
                        type="text" id="reg-id" required autoComplete="off"
                        value={regData.id}
                        onChange={e => setRegData({ ...regData, id: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-dob">Fecha de Nacimiento</label>
                    <input
                        type="date" id="reg-dob" required
                        value={regData.fechaNacimiento}
                        onChange={e => setRegData({ ...regData, fechaNacimiento: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-regimen">Tipo de Régimen</label>
                    <select
                        id="reg-regimen" required
                        value={regData.regimen}
                        onChange={e => setRegData({ ...regData, regimen: e.target.value })}
                    >
                        <option value="" disabled>Seleccione una opción...</option>
                        <option value="Contributivo">Contributivo</option>
                        <option value="Subsidiado">Subsidiado</option>
                    </select>
                </div>
                <button type="submit" className="btn-primary">Finalizar Registro</button>
            </form>
        </section>
    );
}
