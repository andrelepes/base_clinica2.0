import { Navigate, Route, Routes } from 'react-router-dom';
import PacienteDetalhes from '../components/Pacientes/PacienteDetalhes';
import PacientesList from '../components/Pacientes/PacientesList';
import Agenda from '../components/Agenda/Agenda';
import ClinicasList from '../components/Clinicas/ClinicasList';
import Sidebar from '../components/Sidebar';

function HomePage() {
  return (
    <header className="App-header">
      Selecione uma opção na barra lateral para exibir o conteúdo aqui.
    </header>
  );
}

export default function MainRoutes() {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/pacientes/:id" element={<PacienteDetalhes />} />
          <Route path="/pacientes" element={<PacientesList />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/clinicas" element={<ClinicasList />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}
