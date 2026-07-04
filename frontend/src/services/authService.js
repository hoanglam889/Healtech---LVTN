import apiClient from './apiClient';

export const patientLogin = async (email, password) => {
  const response = await apiClient.post('/auth/patient-login', { email, password });
  return response.data;
};

export const patientRegister = async (data) => {
  const response = await apiClient.post('/auth/patient-register', data);
  return response.data;
};

export const staffLogin = async (email, password) => {
  const response = await apiClient.post('/auth/staff-login', { email, password });
  return response.data;
};

export const patientVerifyOtp = async (email, otpCode) => {
  const response = await apiClient.post('/auth/patient-verify-otp', { email, otpCode });
  return response.data;
};

export const updatePatientAccount = async (data) => {
  const response = await apiClient.put('/auth/patient-account/update', data);
  return response.data;
};
export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const verifyResetOtp = async (email, otpCode) => {
  const response = await apiClient.post('/auth/verify-reset-otp', { email, otpCode });
  return response.data;
};

export const resetPassword = async (email, otpCode, newPassword) => {
  const response = await apiClient.post('/auth/reset-password', { email, otpCode, newPassword });
  return response.data;
};
