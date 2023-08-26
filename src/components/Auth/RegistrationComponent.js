import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegistrationComponent = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [funcao, setFuncao] = useState('');
  const [clinicaId, setClinicaId] = useState('');
  const [clinicaSenha, setClinicaSenha] = useState(''); // Senha da clínica

  const navigate = useNavigate();

  // Mapeamento de nomes de clínicas para IDs
  const clinicaMapping = {
    'Clínica A': 1,
    'Clínica B': 2,
    'Nova Clínica': 3
  };

  const handleRegister = async () => {
    const clinicaIdMapped = clinicaMapping[clinicaId];

    try {
      const response = await api.post('/usuarios/registrar', { nome, email, senha: password, funcao, clinica_id: clinicaIdMapped, clinicaSenha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', nome);

      alert('Registro bem-sucedido! Você será redirecionado para a página de login.');
      navigate('/login');
    } catch (error) {
      console.error('Falha no registro:', error);
      alert('Falha no registro. Por favor, tente novamente.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Registro</h1>
      <input type='text' placeholder='Nome' onChange={(e) => setNome(e.target.value)} />
      <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
      <input type='password' placeholder='Senha' onChange={(e) => setPassword(e.target.value)} />
      <select onChange={(e) => setFuncao(e.target.value)}>
        <option value="" disabled selected>Selecione sua função</option>
        <option value="Psicólogo">Psicólogo</option>
        <option value="Responsável Técnico">Responsável Técnico</option>
      </select>
      <select onChange={(e) => setClinicaId(e.target.value)}>
        <option value="" disabled selected>Selecione a clínica</option>
        <option value="Clínica A">Clínica A</option>
        <option value="Clínica B">Clínica B</option>
        <option value="Nova Clínica">Nova Clínica</option>
      </select>
      {funcao === "Responsável Técnico" && (
        <input type='password' placeholder='Senha da Clínica' onChange={(e) => setClinicaSenha(e.target.value)} />
      )}
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
};

export default RegistrationComponent;
