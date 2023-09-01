import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AddClinicaForm from './AddClinicaForm';
import { ClinicaContext } from '../../contexts/ClinicaContext';

function ClinicasList() {
  const [clinicas, setClinicas] = useState([]);
  const { clinicData, setClinicData } = useContext(ClinicaContext);
  const [showForm, setShowForm] = useState(false);
  const [editingClinica, setEditingClinica] = useState(null);

  useEffect(() => {
    fetchClinicas();
  }, []);

  const fetchClinicas = async () => {
    try {
      const response = await api.get('/clinicas');
      setClinicas(response.data);
    } catch (error) {
      console.error('Erro ao buscar as clínicas:', error);
    }
  };

  const handleNewClinica = async (clinicaData) => {
    try {
      if (editingClinica) {
        await api.put(`/clinicas/${editingClinica.id}`, clinicaData);
        setEditingClinica(null);
      } else {
        await api.post('/clinicas', clinicaData);
      }
      fetchClinicas();
      setShowForm(false);
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
        <p>Nome: {clinicData.nome}</p>
        <p>Email: {clinicData.email}</p>
        {/* Add more fields as needed */}
        <button onClick={() => setEditingClinica(clinicData)}>Atualizar Perfil</button>
      </div>

      {showForm && <AddClinicaForm onFormSubmit={handleNewClinica} initialData={editingClinica} />}

      <div>
        <h3>Psicólogos Vinculados</h3>
        {/* List linked psychologists here */}
      </div>

      <div>
        <h3>Secretários Vinculados</h3>
        {/* List linked secretaries here */}
      </div>
    </div>
  );
}

export default ClinicasList;