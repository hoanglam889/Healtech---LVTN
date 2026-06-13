import apiClient from './apiClient';

export const getAllPatients = async () => {
  const response = await apiClient.get('/patients');
  return response.data;
};

export const getPatientsByAccountId = async (accountId) => {
  const response = await apiClient.get('/patients', {
    params: accountId ? { patientAccountId: accountId } : {}
  });
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await apiClient.post('/patients', patientData);
  return response.data;
};

export const updatePatient = async (id, patientData) => {
  const response = await apiClient.patch(`/patients/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await apiClient.delete(`/patients/${id}`);
  return response.data;
};
