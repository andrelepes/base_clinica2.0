import React, { useState } from 'react';
import api from '../../services/api';

const RegistrationComponent = () => {
  const [nome_usuario, setNome] = useState('');
  const [email_usuario, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipousuario, settipousuario] = useState('');
  const [clinicaId] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    // Verificação de campos obrigatórios
    if (!nome_usuario || !email_usuario || !password || !tipousuario) {
      alert('Todos os campos são obrigatórios');
      return;
    }

    try {
      console.log('Dados do formulário:', { nome_usuario, email_usuario, senha: password, tipousuario });
      let payload = { nome_usuario, email_usuario, senha: password, tipousuario };
  
      if (['psicologo_vinculado', 'secretario_vinculado'].includes(tipousuario)) {
        payload = { ...payload, clinica_id: clinicaId };
      }
  
      const response = await api.post('/usuarios/registrar', payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', nome_usuario);
  
      alert('Registro realizado com sucesso!');
      // Forçar um recarregamento da página
      window.location.reload();
    } catch (error) {
      console.error('Erro no registro:', error);
      alert('Erro no registro. Por favor, tente novamente.');
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Registro</h1>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
        <select value={tipousuario} onChange={(e) => settipousuario(e.target.value)}>
          <option value="" disabled>Selecione seu perfil</option>
          <option value="clinica">Clínica</option>
          <option value="psicologo">Psicólogo(a) Autônomo(a)</option>
        </select>
        <input type='text' placeholder='Nome' onChange={(e) => setNome(e.target.value)} />
        <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Senha' onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistrationComponent;
