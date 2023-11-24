import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [tipousuario, setTipousuario] = useState(null);

  function refreshData(verifyToken) {
    if (!usuarioId || !tipousuario || !user) {
      setUsuarioId(verifyToken.user.usuario_id);
      setTipousuario(verifyToken.user.tipousuario);
      getUser(verifyToken.user.usuario_id);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const verifyToken = jwtDecode(token);

    if (verifyToken.exp < Date.now() / 1000) {
      logout();
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    refreshData(verifyToken);
  }, []);

  async function getUser(userId) {
    try {
      const response = await api.get(`/usuarios/${userId}`);
      console.log('Deu bom, setando User');
      setUser(response.data.user);
      toast.success(`Bem-vindo ${response.data.user.nome_usuario}`);
    } catch (error) {}
  }

  async function login({ email_usuario, senha }) {
    try {
      const response = await api.post('/usuarios/login', {
        email_usuario,
        senha,
      });

      const token = response.data.token;

      localStorage.setItem('token', token);
      refreshData(jwtDecode(token));
    } catch (error) {
      toast.error('Falha no login. Verifique seu e-mail e senha');
    }
  }

  async function register({ nome_usuario, email_usuario, senha, tipousuario }) {
    const payload = {
      nome_usuario,
      email_usuario,
      senha,
      tipousuario,
    };
    try {
      const response = await api.post('/usuarios/registrar', payload);
      localStorage.setItem('token', response.data.token);
      const token = response.data.token;

      localStorage.setItem('token', token);
      refreshData(jwtDecode(token));
      toast.success('Registro realizado com sucesso!');
    } catch (error) {
      toast.error('Erro no registro. Por favor, tente novamente.');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    setUsuarioId(null);
    setTipousuario(null);
    toast.info('Sua sessão expirou, faça login novamente');
  }

  const values = {
    login,
    register,
    logout,
    user,
    setUser,
    usuarioId,
    setUsuarioId,
    tipousuario,
    setTipousuario,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
