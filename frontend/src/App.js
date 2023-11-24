import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'dayjs/locale/pt-br.js';
import { ClinicaProvider } from './contexts/ClinicaContext'; // Import ClinicaProvider
import { ClinicaIdProvider } from './contexts/ClinicaIdContext'; // Import ClinicaIdProvider
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Theme } from './styles/theme';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AppRoutes from './routes/index.jsx';

function App() {
  const token = localStorage.getItem('token');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <ThemeProvider theme={Theme}>
        <AuthProvider>
          <CssBaseline />
          <ClinicaIdProvider>
            <ClinicaProvider>
              <div className="App">
                <AppRoutes />
              </div>
            </ClinicaProvider>
          </ClinicaIdProvider>
        </AuthProvider>
      </ThemeProvider>
      <ToastContainer autoClose={3000} />
    </LocalizationProvider>
  );
}

export default App;
