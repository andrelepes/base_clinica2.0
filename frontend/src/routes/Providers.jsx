import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AuthProvider } from '../contexts/AuthContext';
import { ClinicaIdProvider } from '../contexts/ClinicaIdContext';
import { ClinicaProvider } from '../contexts/ClinicaContext';
import { Outlet } from 'react-router-dom';

export default function Providers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <AuthProvider>
        {/* <ClinicaIdProvider>
            <ClinicaProvider>
            </ClinicaProvider>
          </ClinicaIdProvider> */}
        <Outlet />
      </AuthProvider>
    </LocalizationProvider>
  );
}
