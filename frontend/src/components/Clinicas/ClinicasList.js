import React, { useState, useContext } from 'react';
import api from '../../services/api';
import AddClinicaForm from './AddClinicaForm';
import { ClinicaContext } from '../../contexts/ClinicaContext';

function ClinicasList() {
  const { clinica, setClinica } = useContext(ClinicaContext);
  const [showForm, setShowForm] = useState(false);
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

      // Atualizando o estado da clínica após uma operação bem-sucedida
      setClinica(response.data);

    } catch (error) {
      console.error('Erro ao adicionar/atualizar clínica:', error);
      alert('Ocorreu um erro ao adicionar/atualizar a clínica.');
    }
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
        <button onClick={() => { /* Adicione a função para adicionar psicólogo */ }}>Adicionar Psicólogo</button>
      </div>

      <div>
        <h3>Secretários Vinculados</h3>
        <button onClick={() => { /* Adicione a função para adicionar secretário */ }}>Adicionar Secretário</button>
      </div>
    </div>
  );
}

export default ClinicasList;
