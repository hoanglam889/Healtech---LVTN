import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PatientsService } from './patients.service';
import { Patients } from '../entities/Patients';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};

describe('PatientsService', () => {
  let service: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: getRepositoryToken(Patients), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('sets isCompleted=true when all required fields are present', async () => {
      const dto = {
        fullName: 'Nguyen Van A',
        dob: '1990-01-01',
        cccd: '123456789012',
        address: '123 Le Loi, HCM',
        gender: 'M',
        phone: '0901234567',
        patientAccountId: 1,
        relationship: 'Bản thân',
      };
      const patient = { id: 1, ...dto, isCompleted: true };
      mockRepo.create.mockReturnValue(patient);
      mockRepo.save.mockResolvedValue(patient);

      await service.create(dto as any);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ isCompleted: true }),
      );
    });

    it('sets isCompleted=false when phone is missing', async () => {
      const dto = {
        fullName: 'Nguyen Van B',
        dob: '1990-01-01',
        cccd: '123456789012',
        address: '123 Le Loi',
        gender: 'M',
        patientAccountId: 1,
      };
      const patient = { id: 2, ...dto, isCompleted: false };
      mockRepo.create.mockReturnValue(patient);
      mockRepo.save.mockResolvedValue(patient);

      await service.create(dto as any);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ isCompleted: false }),
      );
    });

    it('sets isCompleted=false when only fullName is provided', async () => {
      const dto = { fullName: 'Partial Patient', patientAccountId: 1 };
      const patient = { id: 3, ...dto, isCompleted: false };
      mockRepo.create.mockReturnValue(patient);
      mockRepo.save.mockResolvedValue(patient);

      await service.create(dto as any);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ isCompleted: false }),
      );
    });
  });

  describe('findAll', () => {
    it('returns all patients when no filter is provided', async () => {
      const patients = [{ id: 1 }, { id: 2 }];
      mockRepo.find.mockResolvedValue(patients);

      const result = await service.findAll();

      expect(mockRepo.find).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual(patients);
    });

    it('filters by patientAccountId when provided', async () => {
      mockRepo.find.mockResolvedValue([]);

      await service.findAll(5);

      expect(mockRepo.find).toHaveBeenCalledWith({ where: { patientAccountId: 5 } });
    });
  });

  describe('findOne', () => {
    it('returns patient when found', async () => {
      const patient = { id: 1, fullName: 'Nguyen Van A' };
      mockRepo.findOneBy.mockResolvedValue(patient);

      const result = await service.findOne(1);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(patient);
    });

    it('throws NotFoundException when patient does not exist', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('recalculates isCompleted=true when update completes the profile', async () => {
      const existing = {
        id: 1, fullName: 'A', dob: '1990-01-01',
        cccd: '123', address: '123 St', gender: 'M', phone: null,
      };
      const afterUpdate = { ...existing, phone: '0901234567', isCompleted: true };
      mockRepo.findOneBy
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(afterUpdate);
      mockRepo.update.mockResolvedValue({});

      await service.update(1, { phone: '0901234567' } as any);

      expect(mockRepo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ isCompleted: true }),
      );
    });

    it('recalculates isCompleted=false when profile remains incomplete after update', async () => {
      const existing = {
        id: 1, fullName: 'A', dob: null, cccd: null, address: null, gender: null, phone: null,
      };
      mockRepo.findOneBy
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce({ ...existing, fullName: 'Updated A' });
      mockRepo.update.mockResolvedValue({});

      await service.update(1, { fullName: 'Updated A' } as any);

      expect(mockRepo.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ isCompleted: false }),
      );
    });

    it('throws NotFoundException when patient to update does not exist', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, {} as any)).rejects.toThrow(NotFoundException);
    });

    it('returns the updated patient from findOne after save', async () => {
      const existing = {
        id: 1, fullName: 'Old', dob: '1990-01-01',
        cccd: '123', address: '123', gender: 'M', phone: '090',
      };
      const updated = { ...existing, fullName: 'New Name', isCompleted: true };
      mockRepo.findOneBy
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(updated);
      mockRepo.update.mockResolvedValue({});

      const result = await service.update(1, { fullName: 'New Name' } as any);

      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('removes patient and returns success', async () => {
      const patient = { id: 1, fullName: 'Nguyen Van A' };
      mockRepo.findOneBy.mockResolvedValue(patient);
      mockRepo.remove.mockResolvedValue({});

      const result = await service.remove(1);

      expect(result.success).toBe(true);
      expect(mockRepo.remove).toHaveBeenCalledWith(patient);
    });

    it('throws NotFoundException when patient to remove does not exist', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
