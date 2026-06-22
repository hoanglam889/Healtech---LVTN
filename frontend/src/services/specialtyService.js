import apiClient from './apiClient';

export const getSpecialties = async () => {
  const response = await apiClient.get('/specialties');
  return response.data;
};

export const getSpecialtyById = async (id) => {
  const response = await apiClient.get(`/specialties/${id}`);
  return response.data;
};

export const createSpecialty = async (specialtyData) => {
  const response = await apiClient.post('/specialties', specialtyData);
  return response.data;
};

export const updateSpecialty = async (id, specialtyData) => {
  const response = await apiClient.patch(`/specialties/${id}`, specialtyData);
  return response.data;
};

export const deleteSpecialty = async (id) => {
  const response = await apiClient.delete(`/specialties/${id}`);
  return response.data;
};
