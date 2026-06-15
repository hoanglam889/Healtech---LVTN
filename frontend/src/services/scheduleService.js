import apiClient from './apiClient';

export const getSchedules = (doctorProfileId) => {
  const params = doctorProfileId ? `?doctorProfileId=${doctorProfileId}` : '';
  return apiClient.get(`/doctor-schedules${params}`).then((r) => r.data);
};

export const createSchedule = (data) =>
  apiClient.post('/doctor-schedules', data).then((r) => r.data);

export const deleteSchedule = (id) =>
  apiClient.delete(`/doctor-schedules/${id}`).then((r) => r.data);

export const getShifts = () =>
  apiClient.get('/shifts').then((r) => r.data);

export const getDoctors = () =>
  apiClient.get('/doctor-profiles').then((r) => r.data);
