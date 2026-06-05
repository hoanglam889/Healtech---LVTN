import axios from 'axios';

export const BASE_URL = 'http://localhost:3000/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
