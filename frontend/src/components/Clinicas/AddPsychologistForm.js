import React, { useState } from 'react';
import api from '../../services/api';
import jwt_decode from 'jwt-decode';

function AddPsychologistForm({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: ''  // Novo estado para CPF
  });

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

    // Decodificar o token para obter o clinicaId
    const token = localStorage.getItem('token');
    const decoded = jwt_decode(token);
    const clinicaId = decoded.user.clinica_id;

    try {
      const response = await api.post(`/clinicas/${clinicaId}/add-linked-psychologist`, formData);
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
      <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
  
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
  
      <label htmlFor="cpf">CPF:</label>  {/* Novo campo para CPF */}
      <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />  {/* Novo campo para CPF */}
  
      <button type="submit">Adicionar Psicólogo</button>
    </form>
  );
}

export default AddPsychologistForm;