import apiClient from './apiClient';

export const getDoctors = async () => {
  const response = await apiClient.get('/doctor-profiles');
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await apiClient.get(`/doctor-profiles/${id}`);
  return response.data;
};
