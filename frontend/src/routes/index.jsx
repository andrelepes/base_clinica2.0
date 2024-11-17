import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ErrorPage from '../pages/ErrorPage';
import ProtectedPageLayout from './ProtectedPageLayout';
import Providers from './Providers';
import PatientsList from '../pages/Patient/PatientsList';
import PatientDetails from '../pages/Patient/PatientDetails';
import FirstAccess from '../pages/FirstAccess';
import ClinicDashboard from '../pages/Clinic/ClinicDashboard';
import OfficeAppointmentSchedule from '../pages/Appointment/OfficeAppointmentSchedule';
import MyAppointments from '../pages/Appointment/MyAppointments';
import PatientAppointmentSchedule from '../pages/Appointment/PatientAppointmentSchedule';
import PsychologistAppointmentSchedule from '../pages/Appointment/PsychologistAppointmentSchedule';
import PsychologistsList from '../pages/Psychologist/PsychologistsList';
import Profile from '../pages/Profile';
import Payment from '../pages/Payment/Payment';
import PaymentFailure from '../pages/Payment/PaymentFailure';
import PaymentSuccess from '../pages/Payment/PaymentSucess';
import PaymentsList from '../pages/Payment/PaymentsList';

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
        <Route path="psicologos" element={<PsychologistsList />} />
        <Route path="agenda">
          <Route path="consultorios" element={<OfficeAppointmentSchedule />} />
          <Route path="minha" element={<MyAppointments />} />
          <Route path="pacientes" element={<PatientAppointmentSchedule />} />
          <Route
            path="psicologos"
            element={<PsychologistAppointmentSchedule />}
          />
        </Route>
        <Route path="clinicas" element={<ClinicDashboard />} />
        <Route path="payments">
          <Route path="" element={<PaymentsList />} />
          <Route path="failure" element={<Payment />} />
          <Route path="success/:id" element={<PaymentSuccess />} />
        </Route>
        <Route path="configuracoes" element={<Profile />} />
      </Route>
    </Route>
  )
);
