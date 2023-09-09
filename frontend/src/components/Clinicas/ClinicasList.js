import React, { useState, useContext } from 'react';
import api from '../../services/api';
import AddClinicaForm from './AddClinicaForm';
import AddPsychologistForm from './AddPsychologistForm';
import { ClinicaContext } from '../../contexts/ClinicaContext';
import { useClinicaId } from '../../contexts/ClinicaIdContext';  // Import the ClinicaIdContext

function ClinicasList() {
  const { clinica, setClinica } = useContext(ClinicaContext);
  const { clinicaId, setClinicaId } = useClinicaId();  // Use the ClinicaIdContext
  const [showForm, setShowForm] = useState(false);
  const [showPsychologistForm, setShowPsychologistForm] = useState(false);
  const [editingClinica, setEditingClinica] = useState(null);

  const handleNewClinica = async (clinicaData) => {
    try {
      let response;
      if (editingClinica) {
        response = await api.put(`/clinicas/${editingClinica.id}`, clinicaData);
        setEditingClinica(null);
      } else {
        response = await api.post('/clinicas', clinicaData);
      }
      setShowForm(false);
      setClinica(response.data);
      setClinicaId(response.data.id);  // Update the clinicaId
    } catch (error) {
      console.error('Erro ao adicionar/atualizar clínica:', error);
      alert('Ocorreu um erro ao adicionar/atualizar a clínica.');
    }
  };

  const handleNewPsychologist = async (psychologistData) => {
    try {
      const response = await api.post(`/clinicas/${clinicaId}/add-linked-psychologist`, psychologistData);  // Use the clinicaId
      setShowPsychologistForm(false);
    } catch (error) {
      console.error('Erro ao adicionar psicólogo:', error);
      alert('Ocorreu um erro ao adicionar o psicólogo.');
    }
  };

  const handleAddPsicologo = () => {
    setShowPsychologistForm(true);
  };

  const handleAddSecretario = () => {
    alert('Adicionar Secretário foi clicado');
  };

  return (
    <div>
      <h2>Clínica</h2>
      <div>
        <h3>Informações da Clínica</h3>
        <p>Nome: {clinica ? clinica.nome : 'Carregando...'}</p>
        <p>Email: {clinica ? clinica.email : 'Carregando...'}</p>
        <p>CNPJ: {clinica ? clinica.cpfcnpj : 'Carregando...'}</p>
        <p>CEP: {clinica ? clinica.cep : 'Carregando...'}</p>
        <p>Endereço: {clinica ? clinica.endereco : 'Carregando...'}</p>
        <p>Telefone: {clinica ? clinica.telefone : 'Carregando...'}</p>
        <button onClick={() => { setEditingClinica(clinica); setShowForm(true); }}>Atualizar Perfil</button>
      </div>
      {showForm && <AddClinicaForm onFormSubmit={handleNewClinica} initialData={editingClinica} />}
      <div>
        <h3>Psicólogos Vinculados</h3>
        <button onClick={handleAddPsicologo}>Adicionar Psicólogo</button>
      </div>
      {showPsychologistForm && <AddPsychologistForm onFormSubmit={handleNewPsychologist} />}
      <div>
        <h3>Secretários Vinculados</h3>
        <button onClick={handleAddSecretario}>Adicionar Secretário</button>
      </div>
    </div>
  );
}

export default ClinicasList;
