import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // URL base do seu back-end
});

// Interceptor para adicionar o token JWT ao cabeçalho 'x-auth-token'
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
    console.log('Token adicionado ao cabeçalho:', token);  // Adicionado para depuração
  }
  return config;
}, (error) => {
  console.error('Erro ao adicionar o token ao cabeçalho:', error);  // Adicionado para depuração
  return Promise.reject(error);
});

export default api;