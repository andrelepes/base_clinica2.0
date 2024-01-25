import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Agenda from '../components/Agenda/Agenda';
import ErrorPage from '../pages/ErrorPage';
import ProtectedPageLayout from './ProtectedPageLayout';
import Providers from './Providers';
import PatientsList from '../pages/Patient/PatientsList';
import PatientDetails from '../pages/Patient/PatientDetails';
import FirstAccess from '../pages/FirstAccess';
import ClinicDashboard from '../pages/Clinic/ClinicDashboard';

function HomePage() {
  return (
    <header className="App-header">
      Selecione uma opção na barra lateral para exibir o conteúdo aqui.
    </header>
  );
}

function IsAuthenticated({ redirectPath }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />} errorElement={<ErrorPage />}>
      <Route element={<IsAuthenticated redirectPath="/" />}>
        <Route path="/login" element={<Login />} />
        <Route path="/primeiro-acesso/:hash" element={<FirstAccess />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/"
        element={<ProtectedPageLayout redirectPath="/login" />}
        errorElement={<ErrorPage />}
      >
        <Route index element={<HomePage />} />
        <Route path="pacientes/:id" element={<PatientDetails />} />
        <Route path="pacientes" element={<PatientsList />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="clinicas" element={<ClinicDashboard />} />
      </Route>
    </Route>
  )
);
