import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SpecialtiesService } from './specialties.service';
import { Specialties } from '../entities/Specialties';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
};

describe('SpecialtiesService', () => {
  let service: SpecialtiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialtiesService,
        { provide: getRepositoryToken(Specialties), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<SpecialtiesService>(SpecialtiesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates and saves a specialty, returning the saved entity', async () => {
      const dto = { name: 'Cardiology', description: 'Heart disorders' };
      const entity = { id: 1, ...dto };
      mockRepo.create.mockReturnValue(entity);
      mockRepo.save.mockResolvedValue(entity);

      const result = await service.create(dto as any);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });
  });

  describe('findAll', () => {
    it('returns all specialties', async () => {
      const specialties = [{ id: 1, name: 'Cardiology' }, { id: 2, name: 'Neurology' }];
      mockRepo.find.mockResolvedValue(specialties);

      const result = await service.findAll();

      expect(result).toEqual(specialties);
      expect(mockRepo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('returns specialty when found', async () => {
      const specialty = { id: 1, name: 'Cardiology' };
      mockRepo.findOne.mockResolvedValue(specialty);

      const result = await service.findOne(1);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(specialty);
    });

    it('throws NotFoundException when specialty does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('merges dto into existing entity and saves', async () => {
      const existing = { id: 1, name: 'Old Name', description: 'Old desc' };
      const updated = { id: 1, name: 'New Name', description: 'Old desc' };
      mockRepo.findOne.mockResolvedValue(existing);
      mockRepo.merge.mockImplementation(() => undefined);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'New Name' } as any);

      expect(mockRepo.merge).toHaveBeenCalledWith(existing, { name: 'New Name' });
      expect(mockRepo.save).toHaveBeenCalledWith(existing);
      expect(result).toEqual(updated);
    });

    it('throws NotFoundException when specialty to update does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.update(99, { name: 'X' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes specialty and returns success message', async () => {
      const specialty = { id: 1, name: 'Cardiology' };
      mockRepo.findOne.mockResolvedValue(specialty);
      mockRepo.remove.mockResolvedValue({});

      const result = await service.remove(1);

      expect(result.success).toBe(true);
      expect(mockRepo.remove).toHaveBeenCalledWith(specialty);
    });

    it('throws NotFoundException when specialty to remove does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
