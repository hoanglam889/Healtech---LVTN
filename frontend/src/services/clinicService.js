import apiClient from './apiClient';

export const getAllServices = async () => {
  const response = await apiClient.get('/services');
  return response.data;
};

export const getAppointmentServices = async (appointmentId) => {
  const response = await apiClient.get(`/appointment-services/appointment/${appointmentId}`);
  return response.data;
};

export const addAppointmentService = async (data) => {
  const response = await apiClient.post('/appointment-services', data);
  return response.data;
};

export const removeAppointmentService = async (id) => {
  const response = await apiClient.delete(`/appointment-services/${id}`);
  return response.data;
};
