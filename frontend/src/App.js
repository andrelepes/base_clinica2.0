import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import PacientesList from './components/Pacientes/PacientesList';
import PacienteDetalhes from './components/Pacientes/PacienteDetalhes';
import Agenda from './components/Agenda/Agenda';
import RegistrationComponent from './components/Auth/RegistrationComponent';
import ClinicasList from './components/Clinicas/ClinicasList';
import { ClinicaProvider } from './contexts/ClinicaContext'; // Import ClinicaProvider
import { ClinicaIdProvider } from './contexts/ClinicaIdContext'; // Import ClinicaIdProvider
import Login from './pages/Login';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Theme } from './styles/theme';

function HomePage() {
  return (
    <header className="App-header">
      Selecione uma opção na barra lateral para exibir o conteúdo aqui.
    </header>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      console.log('Evento de armazenamento disparado, novo token:', newToken);
      setToken(newToken);
    };

    const initialToken = localStorage.getItem('token');
    setToken(initialToken);

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline/>
      <ClinicaIdProvider>
        {' '}
        {/* Wrap the components with ClinicaIdProvider */}
        <ClinicaProvider>
          {' '}
          {/* Wrap the components with ClinicaProvider */}
          <Router>
            <div className="App">
              {token ? (
                <>
                  <div className="sidebar">
                    <Sidebar />
                  </div>
                  <div className="main-content">
                    <Routes>
                      <Route
                        path="/pacientes/:id"
                        element={<PacienteDetalhes />}
                      />
                      <Route path="/pacientes" element={<PacientesList />} />
                      <Route path="/agenda" element={<Agenda />} />
                      <Route path="/" element={<HomePage />} />
                      <Route path="/clinicas" element={<ClinicasList />} />
                    </Routes>
                  </div>
                </>
              ) : (
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<RegistrationComponent />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              )}
            </div>
          </Router>
        </ClinicaProvider>
      </ClinicaIdProvider>
    </ThemeProvider>
  );
}

export default App;
