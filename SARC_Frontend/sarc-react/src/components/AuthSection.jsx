import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthSection() {
    const [tab, setTab] = useState('login');
    const [showLoginId, setShowLoginId] = useState(false);
    const { login, registrarPaciente } = useApp();

    const [loginData, setLoginData] = useState({ nombre: '', id: '' });
    const [regData, setRegData] = useState({
        nombre: '',
        id: '',
        fechaNacimiento: '',
        regimen: '',
        celular: '',
        correo: ''
    });

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
            regimen: regData.regimen,
            celular: regData.celular.trim(),
            correo: regData.correo.trim()
        });

        if (ok) {
            setRegData({ nombre: '', id: '', fechaNacimiento: '', regimen: '', celular: '', correo: '' });
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
                    Registrarse
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
                    <div className="password-input">
                        <input
                            type={showLoginId ? 'text' : 'password'} id="login-id" required autoComplete="off"
                            value={loginData.id}
                            onChange={e => setLoginData({ ...loginData, id: e.target.value })}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowLoginId(!showLoginId)}
                            aria-label={showLoginId ? 'Ocultar identificación' : 'Mostrar identificación'}
                            aria-pressed={showLoginId}
                            title={showLoginId ? 'Ocultar identificación' : 'Mostrar identificación'}
                        >
                            {showLoginId ? (
                                <>
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.7 4.2 9.8 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C4.6 7.4 3.2 9.2 2.2 12c1.1 2.8 4.6 7 9.8 7 1.1 0 2.1-.2 3-.5" />
                                    </svg>
                                    <span>Ocultar</span>
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M2.2 12C3.3 9.2 6.8 5 12 5s8.7 4.2 9.8 7c-1.1 2.8-4.6 7-9.8 7s-8.7-4.2-9.8-7Z" />
                                        <circle cx="12" cy="12" r="2.5" />
                                    </svg>
                                    <span>Mostrar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn-primary">Acceder al Sistema</button>
            </form>

            <form className={`auth-form${tab === 'register' ? ' active' : ''}`} onSubmit={handleRegister}>
                <h3>Registrarse</h3>
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
                <div className="form-group">
                    <label htmlFor="reg-celular">Número de Celular</label>
                    <input
                        type="tel" id="reg-celular" required autoComplete="tel"
                        value={regData.celular}
                        onChange={e => setRegData({ ...regData, celular: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-email">Correo Electrónico</label>
                    <input
                        type="email" id="reg-email" required autoComplete="email"
                        value={regData.correo}
                        onChange={e => setRegData({ ...regData, correo: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn-primary">Finalizar Registro</button>
            </form>
        </section>
    );
}
