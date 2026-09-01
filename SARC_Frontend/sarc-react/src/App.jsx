import { useApp } from './context/AppContext';
import Header from './components/Header';
import WelcomeOverlay from './components/WelcomeOverlay';
import AuthSection from './components/AuthSection';
import Panel_Paciente from './components/Panel_Paciente';
import Panel_Recepcionista from './components/Panel_Recepcionista';
import Panel_Medico from './components/Panel_Medico';

export default function App() {
    const { currentUser } = useApp();

    return (
        <>
            <div className="background-overlay"></div>
            <Header />
            <WelcomeOverlay />

            <div className="main-container">
                {!currentUser && <AuthSection />}
                {currentUser && currentUser.tipo === 'paciente' && <Panel_Paciente />}
                {currentUser && currentUser.tipo === 'recepcionista' && <Panel_Recepcionista />}
                {currentUser && currentUser.tipo === 'medico' && <Panel_Medico />}
            </div>
        </>
    );
}
