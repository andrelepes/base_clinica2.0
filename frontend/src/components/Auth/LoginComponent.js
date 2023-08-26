import React, { useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Evitar o comportamento padrão do formulário
    console.log(`Tentando fazer login com email: ${email} e senha: ${senha}`);
    try {
      const response = await api.post('/usuarios/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      setErrorMsg('');

      console.log('Login bem-sucedido:', response.data);

      // Forçar um recarregamento da página
      window.location.reload();
    } catch (error) {
      console.error('Falha no login:', error);
      setErrorMsg('Falha no login. Verifique seu e-mail e senha.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Senha' onChange={(e) => setSenha(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
      {errorMsg && <p>{errorMsg}</p>}
      <Link to="/register">Não tem uma conta? Registre-se aqui.</Link>
    </div>
  );
};

export default LoginComponent;
