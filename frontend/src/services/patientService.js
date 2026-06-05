import apiClient from './apiClient';

export const getPatients = async () => {
  const response = await apiClient.get('/patients');
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await apiClient.post('/patients', patientData);
  return response.data;
};
