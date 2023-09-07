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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/path/to/add/psychologist', formData); // Substitua pelo caminho real da API
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
