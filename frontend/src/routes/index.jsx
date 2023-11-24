import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MainRoutes from './main.routes';
import AuthRoutes from './auth.routes';

export default function AppRoutes() {
  const { usuarioId } = useAuth();
  return <Router>{usuarioId ? <MainRoutes /> : <AuthRoutes />}</Router>;
}
