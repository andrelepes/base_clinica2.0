import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AuthProvider } from '../contexts/AuthContext';
import { Outlet } from 'react-router-dom';

export default function Providers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </LocalizationProvider>
  );
}
