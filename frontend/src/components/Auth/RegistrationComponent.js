import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegistrationComponent = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, settipoUsuario] = useState('');
  const [clinicaId] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    // Verificação de campos obrigatórios
    if (!nome || !email || !password || !tipoUsuario) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    try {
      console.log('Dados do formulário:', { nome, email, senha: password, tipoUsuario });
      let payload = { nome, email, senha: password, tipoUsuario };
  
      if (['Psicologo Vinculado', 'Secretario Vinculado'].includes(tipoUsuario)) {
        payload = { ...payload, clinica_id: clinicaId };
      }
  
      const response = await api.post('/usuarios/registrar', payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', nome);
  
      alert('Registro realizado com sucesso! Você será redirecionado para a página de login.');
      navigate('/login');
    } catch (error) {
      console.error('Erro no registro:', error);
      alert('Erro no registro. Por favor, tente novamente.');
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Registro</h1>
      <select value={tipoUsuario} onChange={(e) => settipoUsuario(e.target.value)}>
        <option value="" disabled>Selecione seu perfil</option>
        <option value="Clinica">Clínica</option>
        <option value="Psicologo Autonomo">Psicólogo(a) Autônomo(a)</option>
      </select>
      <input type='text' placeholder='Nome' onChange={(e) => setNome(e.target.value)} />
      <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
      <input type='password' placeholder='Senha' onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
};

export default RegistrationComponent;
