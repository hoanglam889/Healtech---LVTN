import apiClient from './apiClient';

export const getInvoiceDetails = async (appointmentId) => {
  const response = await apiClient.get(`/invoices/details/${appointmentId}`);
  return response.data;
};
