import apiClient from './apiClient';

export const patientLogin = async (email, password) => {
  const response = await apiClient.post('/auth/patient-login', { email, password });
  return response.data;
};

export const patientRegister = async (data) => {
  const response = await apiClient.post('/auth/patient-register', data);
  return response.data;
};

export const staffLogin = async (email, password) => {
  const response = await apiClient.post('/auth/staff-login', { email, password });
  return response.data;
};

