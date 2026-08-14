import axios from 'axios';

export const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/' : 'http://14.225.218.191:3000/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
