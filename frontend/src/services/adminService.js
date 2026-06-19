import apiClient from './apiClient';

export const getAdminStats = async () => {
  const response = await apiClient.get('/admin/dashboard-stats');
  return response.data;
};

export const getAdminSchedules = async () => {
  const response = await apiClient.get('/admin/schedules');
  return response.data;
};

export const createAdminSchedule = async (scheduleData) => {
  const response = await apiClient.post('/admin/schedules', scheduleData);
  return response.data;
};

export const deleteAdminSchedule = async (id) => {
  const response = await apiClient.delete(`/admin/schedules/${id}`);
  return response.data;
};

export const getAdminShifts = async () => {
  const response = await apiClient.get('/admin/shifts');
  return response.data;
};
