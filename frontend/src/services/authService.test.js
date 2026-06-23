import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

import apiClient from './apiClient';
import { patientLogin, patientRegister, staffLogin } from './authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('patientLogin', () => {
    it('calls POST /auth/patient-login with email and password', async () => {
      apiClient.post.mockResolvedValue({ data: { success: true, access_token: 'tok' } });

      const result = await patientLogin('user@test.com', 'pass123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/patient-login', {
        email: 'user@test.com',
        password: 'pass123',
      });
      expect(result).toEqual({ success: true, access_token: 'tok' });
    });

    it('returns the response data directly', async () => {
      const responseData = { success: true, user: { role: 'PATIENT' }, access_token: 'jwt' };
      apiClient.post.mockResolvedValue({ data: responseData });

      const result = await patientLogin('a@b.com', 'pw');

      expect(result).toEqual(responseData);
    });

    it('propagates network errors from the API', async () => {
      apiClient.post.mockRejectedValue(new Error('Network Error'));

      await expect(patientLogin('user@test.com', 'pass')).rejects.toThrow('Network Error');
    });
  });

  describe('patientRegister', () => {
    it('calls POST /auth/patient-register with the provided data object', async () => {
      const data = { email: 'new@test.com', password: 'pass', fullName: 'New User' };
      apiClient.post.mockResolvedValue({ data: { success: true } });

      const result = await patientRegister(data);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/patient-register', data);
      expect(result.success).toBe(true);
    });

    it('propagates API errors during registration', async () => {
      apiClient.post.mockRejectedValue(new Error('Conflict'));

      await expect(patientRegister({ email: 'dup@test.com' })).rejects.toThrow('Conflict');
    });
  });

  describe('staffLogin', () => {
    it('calls POST /auth/staff-login with phone and password', async () => {
      apiClient.post.mockResolvedValue({ data: { success: true, user: { role: 'STAFF' } } });

      const result = await staffLogin('008', '1');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/staff-login', {
        phone: '008',
        password: '1',
      });
      expect(result.user.role).toBe('STAFF');
    });

    it('calls POST /auth/staff-login for doctor login', async () => {
      apiClient.post.mockResolvedValue({
        data: { success: true, user: { role: 'DOCTOR', doctorProfileId: 10 } },
      });

      const result = await staffLogin('004', '1');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/staff-login', {
        phone: '004',
        password: '1',
      });
      expect(result.user.role).toBe('DOCTOR');
      expect(result.user.doctorProfileId).toBe(10);
    });
  });
});
