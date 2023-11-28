import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [clinicaId, setClinicaId] = useState(null);
  const [tipousuario, setTipousuario] = useState(null);

  const navigate = useNavigate();

  function refreshData(verifyToken) {
    if (!usuarioId || !tipousuario || !user) {
      api.defaults.headers.common.Authorization = `Bearer ${verifyToken}`;
      setUsuarioId(verifyToken.user.usuario_id);
      setClinicaId(verifyToken.user.clinica_id);
      setTipousuario(verifyToken.user.tipousuario);
      getUser(verifyToken.user.usuario_id);
    }
  }

  let didInit = false;

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const verifyToken = jwtDecode(token);

      if (verifyToken.exp < Date.now() / 1000) {
        logout();
        return;
      }

      refreshData(verifyToken);
    }
  }, []);

  async function getUser(userId) {
    try {
      const response = await api.get(`/usuarios/${userId}`);
      setUser(response.data.user);
      toast.success(`Bem-vindo ${response.data.user.nome_usuario}`);
    } catch (error) {
      toast.error('Ocorreu um erro ao resgatar suas informações');
    }
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

      navigate('/');
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
      navigate('/');
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
    navigate('/login');
  }

  const values = {
    login,
    register,
    logout,
    user,
    setUser,
    clinicaId,
    setClinicaId,
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
