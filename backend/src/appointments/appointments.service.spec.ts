import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppointmentsService } from './appointments.service';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { MedicalRecords } from '../entities/MedicalRecords';

const mockAppointmentsRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
const mockInvoicesRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
};
const mockMedicalRecordsRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
};
const mockDataSource = {
  createQueryRunner: jest.fn(),
  getRepository: jest.fn(),
};

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointments), useValue: mockAppointmentsRepo },
        { provide: getRepositoryToken(Invoices), useValue: mockInvoicesRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    jest.clearAllMocks();
    mockDataSource.getRepository.mockReturnValue(mockMedicalRecordsRepo);
  });

  describe('findAll', () => {
    it('returns all appointments when no userId given', async () => {
      const appts = [{ id: 1 }, { id: 2 }];
      mockAppointmentsRepo.find.mockResolvedValue(appts);

      const result = await service.findAll();

      expect(result).toEqual(appts);
      expect(mockAppointmentsRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('filters by patientAccountId when userId is provided', async () => {
      mockAppointmentsRepo.find.mockResolvedValue([]);

      await service.findAll(42);

      expect(mockAppointmentsRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { patient: { patientAccountId: 42 } } }),
      );
    });
  });

  describe('findOne', () => {
    it('returns appointment when found', async () => {
      const appt = { id: 1, status: 'BOOKED' };
      mockAppointmentsRepo.findOne.mockResolvedValue(appt);

      const result = await service.findOne(1);

      expect(result).toEqual(appt);
    });

    it('throws NotFoundException when appointment does not exist', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update — status transitions', () => {
    it('throws BadRequestException for invalid transition DONE → WAITING', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue({
        id: 1, status: 'DONE', patient: { isCompleted: true }, invoices: null,
      });

      await expect(service.update(1, { status: 'WAITING' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid transition CANCELLED → EXAMINING', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue({
        id: 1, status: 'CANCELLED', patient: { isCompleted: true }, invoices: null,
      });

      await expect(service.update(1, { status: 'EXAMINING' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid transition EXAMINING → BOOKED', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue({
        id: 1, status: 'EXAMINING', patient: { isCompleted: true }, invoices: null,
      });

      await expect(service.update(1, { status: 'BOOKED' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when transitioning to WAITING with incomplete patient', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue({
        id: 1, status: 'BOOKED', patient: { isCompleted: false }, invoices: null,
      });

      await expect(service.update(1, { status: 'WAITING' })).rejects.toThrow(BadRequestException);
    });

    it('allows valid transition BOOKED → CANCELLED', async () => {
      mockAppointmentsRepo.findOne
        .mockResolvedValueOnce({ id: 1, status: 'BOOKED', patient: { isCompleted: true }, invoices: null })
        .mockResolvedValueOnce({ id: 1, status: 'CANCELLED' });
      mockAppointmentsRepo.update.mockResolvedValue({});
      mockInvoicesRepo.findOne.mockResolvedValue(null);

      const result = await service.update(1, { status: 'CANCELLED' });

      expect(result.status).toBe('CANCELLED');
    });

    it('allows valid transition WAITING → EXAMINING', async () => {
      mockAppointmentsRepo.findOne
        .mockResolvedValueOnce({ id: 1, status: 'WAITING', patient: { isCompleted: true }, invoices: null })
        .mockResolvedValueOnce({ id: 1, status: 'EXAMINING' });
      mockAppointmentsRepo.update.mockResolvedValue({});

      const result = await service.update(1, { status: 'EXAMINING' });

      expect(result.status).toBe('EXAMINING');
    });
  });

  describe('update — priority score on WAITING transition', () => {
    const today = new Date();

    function dob(yearsAgo: number): string {
      return `${today.getFullYear() - yearsAgo}-01-01`;
    }

    beforeEach(() => {
      mockAppointmentsRepo.update.mockResolvedValue({});
      mockInvoicesRepo.findOne.mockResolvedValue(null);
    });

    it('uses base score 8 for patient older than 60', async () => {
      mockAppointmentsRepo.findOne
        .mockResolvedValueOnce({
          id: 1, status: 'BOOKED',
          patient: { isCompleted: true, dob: dob(65) },
          invoices: { status: 'UNPAID' },
          appointmentDate: '2099-12-31',
          appointmentTime: '23:59:00',
        })
        .mockResolvedValueOnce({ id: 1, status: 'WAITING' });

      await service.update(1, { status: 'WAITING' });

      const [, updateFields] = mockAppointmentsRepo.update.mock.calls[0];
      // base 8 + booked via app 1 + not paid 0 + not late 0 = 9
      expect(updateFields.priorityScore).toBe(9);
    });

    it('uses base score 8 for patient younger than 6', async () => {
      mockAppointmentsRepo.findOne
        .mockResolvedValueOnce({
          id: 1, status: 'BOOKED',
          patient: { isCompleted: true, dob: dob(3) },
          invoices: { status: 'UNPAID' },
          appointmentDate: '2099-12-31',
          appointmentTime: '23:59:00',
        })
        .mockResolvedValueOnce({ id: 1, status: 'WAITING' });

      await service.update(1, { status: 'WAITING' });

      const [, updateFields] = mockAppointmentsRepo.update.mock.calls[0];
      expect(updateFields.priorityScore).toBe(9);
    });

    it('uses base score 5 for patient aged 30', async () => {
      const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
      const futureDate = future.toISOString().split('T')[0];
      const futureTime = future.toTimeString().substring(0, 8);

      mockAppointmentsRepo.findOne
        .mockResolvedValueOnce({
          id: 1, status: 'BOOKED',
          patient: { isCompleted: true, dob: dob(30) },
          invoices: { status: 'UNPAID' },
          appointmentDate: futureDate,
          appointmentTime: futureTime,
        })
        .mockResolvedValueOnce({ id: 1, status: 'WAITING' });

      await service.update(1, { status: 'WAITING' });

      const [, updateFields] = mockAppointmentsRepo.update.mock.calls[0];
      // base 5 + booked via app 1 + not paid 0 + not late 0 = 6
      expect(updateFields.priorityScore).toBe(6);
    });

    it('adds +1 when invoice is pre-paid via VNPAY', async () => {
      const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
      const futureDate = future.toISOString().split('T')[0];
      const futureTime = future.toTimeString().substring(0, 8);

      mockAppointmentsRepo.findOne
        .mockResolvedValueOnce({
          id: 1, status: 'BOOKED',
          patient: { isCompleted: true, dob: dob(30) },
          invoices: { status: 'PAID' },
          appointmentDate: futureDate,
          appointmentTime: futureTime,
        })
        .mockResolvedValueOnce({ id: 1, status: 'WAITING' });

      await service.update(1, { status: 'WAITING' });

      const [, updateFields] = mockAppointmentsRepo.update.mock.calls[0];
      // base 5 + booked via app 1 + paid 1 + not late 0 = 7
      expect(updateFields.priorityScore).toBe(7);
    });

    it('subtracts 2 when patient arrives more than 20 minutes late', async () => {
      mockAppointmentsRepo.findOne
        .mockResolvedValueOnce({
          id: 1, status: 'BOOKED',
          patient: { isCompleted: true, dob: dob(30) },
          invoices: { status: 'UNPAID' },
          appointmentDate: '2020-01-01',
          appointmentTime: '08:00:00',
        })
        .mockResolvedValueOnce({ id: 1, status: 'WAITING' });

      await service.update(1, { status: 'WAITING' });

      const [, updateFields] = mockAppointmentsRepo.update.mock.calls[0];
      // base 5 + booked via app 1 + not paid 0 - late 2 = 4
      expect(updateFields.priorityScore).toBe(4);
    });
  });

  describe('remove', () => {
    it('removes appointment and returns success', async () => {
      const appt = { id: 1, status: 'BOOKED' };
      mockAppointmentsRepo.findOne.mockResolvedValue(appt);
      mockAppointmentsRepo.remove.mockResolvedValue({});

      const result = await service.remove(1);

      expect(result.success).toBe(true);
      expect(mockAppointmentsRepo.remove).toHaveBeenCalledWith(appt);
    });

    it('throws NotFoundException when appointment not found', async () => {
      mockAppointmentsRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
