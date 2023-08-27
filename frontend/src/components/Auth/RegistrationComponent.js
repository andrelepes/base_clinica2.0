import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegistrationComponent = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [perfil, setPerfil] = useState(''); // Novo campo Perfil
  const [funcao, setFuncao] = useState('');
  const [clinicaId, setClinicaId] = useState('');
  const [clinicaSenha, setClinicaSenha] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await api.post('/usuarios/registrar', { nome, email, senha: password, perfil, funcao, clinica_id: clinicaId, clinicaSenha }); // Adicionado perfil
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
      <select onChange={(e) => setPerfil(e.target.value)}>
        <option value="" disabled selected>Selecione seu perfil</option>
        <option value="Clinica">Clínica</option>
        <option value="Psicologo Autonomo">Psicólogo(a) Autônomo(a)</option>
        <option value="Psicologo Vinculado">Psicólogo(a) Vinculado(a)</option>
        <option value="Secretario Vinculado">Secretário(a) Vinculado(a)</option>
      </select>
      <input type='text' placeholder='Nome' onChange={(e) => setNome(e.target.value)} />
      <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
      <input type='password' placeholder='Senha' onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
};

export default RegistrationComponent;
