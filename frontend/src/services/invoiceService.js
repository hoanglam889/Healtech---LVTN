import apiClient from './apiClient';

export const getInvoiceDetails = async (appointmentId) => {
  const response = await apiClient.get(`/invoices/details/${appointmentId}`);
  return response.data;
};

export const createPaymentUrl = async (invoiceId, amount) => {
  const response = await apiClient.post('/payments/create-payment-url', { invoiceId, amount });
  return response.data;
};
