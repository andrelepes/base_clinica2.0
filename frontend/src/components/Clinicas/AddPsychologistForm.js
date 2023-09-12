import React, { useState } from 'react';
import api from '../../services/api';
import { useClinicaId } from '../../contexts/ClinicaIdContext';  // Importar o novo contexto

function AddPsychologistForm({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    nome_usuario: '',
    email_usuario: '',
  });

  const { clinicaId } = useClinicaId();  // Usar o novo contexto

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log('Dados do formulário atualizados:', formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados enviados para o backend:', formData);

    try {
      const response = await api.post(`/usuario/${clinicaId}/add-linked-psychologist`, formData);  // Usar clinicaId do contexto
      console.log('Resposta do Backend:', response.data);
      onFormSubmit(response.data);
    } catch (error) {
      console.error('Erro ao adicionar psicólogo:', error);
      alert('Ocorreu um erro ao adicionar o psicólogo.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nome">Nome:</label>
      <input type="text" id="nome" name="nome" value={formData.nome_usuario} onChange={handleChange} required />
  
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" value={formData.email_usuario} onChange={handleChange} required />
  
       <button type="submit">Adicionar Psicólogo</button>
    </form>
  );
}

export default AddPsychologistForm;