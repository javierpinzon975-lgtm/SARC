import { useApp } from '../context/AppContext';

export default function WelcomeOverlay() {
    const { welcomeName, currentUser } = useApp();
    const visible = Boolean(welcomeName);

    const rol = currentUser && currentUser.tipo
        ? currentUser.tipo.charAt(0).toUpperCase() + currentUser.tipo.slice(1)
        : '';

    return (
        <div id="welcome-overlay" className={`welcome-overlay${visible ? ' visible' : ''}`} aria-hidden={!visible}>
            <div className={`welcome-card${visible ? ' visible' : ''}`} role="dialog" aria-live="polite">
                <div className="welcome-logo">
                    <img src="/img/Logo_PG.png" alt="Logo Clínica" />
                </div>
                <h2>Bienvenido(a), <span>{welcomeName || ''}</span>!</h2>
                <p>{rol}</p>
            </div>
        </div>
    );
}
