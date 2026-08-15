import axios from 'axios';

const hostname = window.location.hostname;
export const BASE_URL = `http://${hostname}:3000/`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
