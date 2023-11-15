import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.104:3000/api', // URL base do seu back-end
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;