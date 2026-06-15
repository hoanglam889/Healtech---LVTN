import apiClient from './apiClient';

export const getNotifications = (patientAccountId) =>
  apiClient.get(`/notifications?patientAccountId=${patientAccountId}`).then((r) => r.data);

export const markAsRead = (id) =>
  apiClient.patch(`/notifications/${id}/read`).then((r) => r.data);

export const markAllAsRead = (patientAccountId) =>
  apiClient.patch(`/notifications/read-all?patientAccountId=${patientAccountId}`).then((r) => r.data);
