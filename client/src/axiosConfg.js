// Crie um arquivo de configuração para o Axios (por exemplo, axiosConfig.js)

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // URL do seu servidor backend
});

// Adicione o token JWT aos cabeçalhos de autorização em cada solicitação
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
