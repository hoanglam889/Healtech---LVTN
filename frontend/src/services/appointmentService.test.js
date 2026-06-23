import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

import apiClient from './apiClient';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsByUserId,
  updateAppointment,
} from './appointmentService';

describe('appointmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('calls POST /appointments with the appointment data', async () => {
      const data = {
        patientId: 1,
        doctorProfileId: 2,
        appointmentDate: '2024-06-20',
        appointmentTime: '09:00:00',
        paymentMethod: 'CASH',
      };
      apiClient.post.mockResolvedValue({ data: { success: true, appointment: { id: 10 } } });

      const result = await createAppointment(data);

      expect(apiClient.post).toHaveBeenCalledWith('/appointments', data);
      expect(result.success).toBe(true);
      expect(result.appointment.id).toBe(10);
    });

    it('propagates errors when creation fails', async () => {
      apiClient.post.mockRejectedValue(new Error('Bad Request'));

      await expect(createAppointment({})).rejects.toThrow('Bad Request');
    });
  });

  describe('getAllAppointments', () => {
    it('calls GET /appointments and returns the response data', async () => {
      const appointments = [{ id: 1, status: 'BOOKED' }, { id: 2, status: 'WAITING' }];
      apiClient.get.mockResolvedValue({ data: appointments });

      const result = await getAllAppointments();

      expect(apiClient.get).toHaveBeenCalledWith('/appointments');
      expect(result).toEqual(appointments);
    });

    it('returns an empty array when there are no appointments', async () => {
      apiClient.get.mockResolvedValue({ data: [] });

      const result = await getAllAppointments();

      expect(result).toEqual([]);
    });
  });

  describe('getAppointmentsByUserId', () => {
    it('calls GET /appointments with userId as a query param', async () => {
      apiClient.get.mockResolvedValue({ data: [{ id: 5 }] });

      const result = await getAppointmentsByUserId(42);

      expect(apiClient.get).toHaveBeenCalledWith('/appointments', { params: { userId: 42 } });
      expect(result).toEqual([{ id: 5 }]);
    });

    it('passes the correct userId for different users', async () => {
      apiClient.get.mockResolvedValue({ data: [] });

      await getAppointmentsByUserId(99);

      expect(apiClient.get).toHaveBeenCalledWith('/appointments', { params: { userId: 99 } });
    });
  });

  describe('updateAppointment', () => {
    it('calls PATCH /appointments/:id with the update payload', async () => {
      const updateData = { status: 'WAITING' };
      apiClient.patch.mockResolvedValue({ data: { id: 1, status: 'WAITING' } });

      const result = await updateAppointment(1, updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/appointments/1', updateData);
      expect(result.status).toBe('WAITING');
    });

    it('sends the correct id in the URL path', async () => {
      apiClient.patch.mockResolvedValue({ data: { id: 7, status: 'DONE' } });

      await updateAppointment(7, { status: 'DONE' });

      expect(apiClient.patch).toHaveBeenCalledWith('/appointments/7', { status: 'DONE' });
    });

    it('propagates errors when update fails', async () => {
      apiClient.patch.mockRejectedValue(new Error('Not Found'));

      await expect(updateAppointment(999, { status: 'DONE' })).rejects.toThrow('Not Found');
    });
  });
});
