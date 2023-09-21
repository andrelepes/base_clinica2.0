import React, { useState, useEffect } from 'react';  
import api from '../../services/api';
import { useClinicaId } from '../../contexts/ClinicaIdContext';

function AddSecretaryForm({ fetchLinkedSecretaries }) {
  const [formData, setFormData] = useState({
    nome_usuario: '',
    email_usuario: '',
  });

  const { clinicaId } = useClinicaId();
  useEffect(() => {
    console.log('Dados do formulário atualizados:', formData);
  }, [formData]);  // Rastrear mudanças no formData

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
    try {
      const response = await api.post(`/usuarios/add-linked-secretary`, {
        ...formData,
        clinicaId
      });
      console.log('Resposta do Backend:', response.data);
      alert('Secretário adicionado com sucesso!');
      fetchLinkedSecretaries();  // Atualizar a lista de secretários vinculados
    } catch (error) {
      console.error('Erro ao adicionar secretário:', error);
      alert('Ocorreu um erro ao adicionar o secretário.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nome_usuario">Nome:</label>
      <input type="text" id="nome_usuario" name="nome_usuario" value={formData.nome_usuario} onChange={handleChange} required />
  
      <label htmlFor="email_usuario">Email:</label>
      <input type="email" id="email_usuario" name="email_usuario" value={formData.email_usuario} onChange={handleChange} required />
  
      <button type="submit">Adicionar Secretário</button>
    </form>
  );  
}

export default AddSecretaryForm;
