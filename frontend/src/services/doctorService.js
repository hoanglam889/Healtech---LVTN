import apiClient from './apiClient';

export const getDoctors = async () => {
  const response = await apiClient.get('/doctor-profiles');
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await apiClient.get(`/doctor-profiles/${id}`);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await apiClient.post('/doctor-profiles', doctorData);
  return response.data;
};

export const updateDoctor = async (id, doctorData) => {
  const response = await apiClient.patch(`/doctor-profiles/${id}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await apiClient.delete(`/doctor-profiles/${id}`);
  return response.data;
};

