import apiClient from './apiClient';

export const patientLogin = async (phone, password) => {
  const response = await apiClient.post('/auth/patient-login', { phone, password });
  return response.data;
};

export const patientRegister = async (data) => {
  const response = await apiClient.post('/auth/patient-register', data);
  return response.data;
};

export const staffLogin = async (phone, password) => {
  const response = await apiClient.post('/auth/staff-login', { phone, password });
  return response.data;
};

