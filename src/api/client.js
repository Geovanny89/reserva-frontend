import axios from 'axios';
import { Capacitor } from '@capacitor/core';

const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const isNativeApp = Capacitor.isNativePlatform();

// Si es APK, priorizar la URL de producción si envApiUrl no está disponible o no es HTTPS
const defaultNativeURL = 'https://www.api-reservas.k-dice.com/api';
const baseURL = isNativeApp 
  ? (envApiUrl && envApiUrl.startsWith('http') ? envApiUrl : defaultNativeURL)
  : (envApiUrl || '/api');

if (isNativeApp) {
  console.log('Capacitor BaseURL:', baseURL);
}

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
