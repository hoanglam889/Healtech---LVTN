import apiClient from './apiClient';

export const createAppointment = async (appointmentData) => {
  const response = await apiClient.post('/appointments', appointmentData);
  return response.data;
};

export const getAllAppointments = async () => {
  const response = await apiClient.get('/appointments');
  return response.data;
};

export const getAppointmentsByUserId = async (userId) => {
  const response = await apiClient.get('/appointments', {
    params: { userId }
  });
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await apiClient.patch(`/appointments/${id}`, appointmentData);
  return response.data;
};
