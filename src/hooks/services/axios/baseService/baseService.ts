import axios from 'axios';
import { urlsServices } from '../../../../configs/urlsConfig';

export const APIFrequencia = axios.create({
  baseURL: urlsServices.BACKENDWS,
});

APIFrequencia.interceptors.response.use(
  async response => response,
  error => {
    if (error.response.status === 500) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  },
);
