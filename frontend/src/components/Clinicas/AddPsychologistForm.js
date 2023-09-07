import React, { useState } from 'react';
import api from '../../services/api';

function AddPsychologistForm({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log('Form Data Updated:', formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados enviados para o backend:', formData);
    const clinicaId = 13; // Substitua pelo ID real da clínica
    try {
      const response = await api.post(`/clinicas/${clinicaId}/add-linked-psychologist`, {
        ...formData,
        clinicaId,
        psychologistId: 25 // Substitua pelo ID real do psicólogo
      });
      console.log('Response from Backend:', response.data);
      onFormSubmit(response.data);
    } catch (error) {
      console.error('Erro ao adicionar psicólogo:', error);
      alert('Ocorreu um erro ao adicionar o psicólogo.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nome">Nome:</label>
      <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />

      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

      <button type="submit">Adicionar Psicólogo</button>
    </form>
  );
}

export default AddPsychologistForm;
