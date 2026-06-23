import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt');
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { Users } from '../entities/Users';
import { PatientAccounts } from '../entities/PatientAccounts';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { Patients } from '../entities/Patients';

const mockUsersRepo = { findOne: jest.fn(), save: jest.fn() };
const mockPatientAccountsRepo = { findOne: jest.fn(), save: jest.fn() };
const mockDoctorProfilesRepo = { findOne: jest.fn() };
const mockPatientsRepo = { save: jest.fn() };
const mockJwtService = { sign: jest.fn().mockReturnValue('mock-jwt-token') };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Users), useValue: mockUsersRepo },
        { provide: getRepositoryToken(PatientAccounts), useValue: mockPatientAccountsRepo },
        { provide: getRepositoryToken(DoctorProfiles), useValue: mockDoctorProfilesRepo },
        { provide: getRepositoryToken(Patients), useValue: mockPatientsRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtService.sign.mockReturnValue('mock-jwt-token');
  });

  describe('staffLogin', () => {
    it('throws UnauthorizedException when user is not found', async () => {
      mockUsersRepo.findOne.mockResolvedValue(null);

      await expect(service.staffLogin('000', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is incorrect', async () => {
      mockUsersRepo.findOne.mockResolvedValue({
        id: 1, phone: '000', passwordHash: '$hash', isActive: true, role: 'STAFF',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.staffLogin('000', 'wrong')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when account is locked', async () => {
      mockUsersRepo.findOne.mockResolvedValue({
        id: 1, phone: '000', passwordHash: '$hash', isActive: false, role: 'STAFF',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.staffLogin('000', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('returns access_token and user data on success', async () => {
      mockUsersRepo.findOne.mockResolvedValue({
        id: 1, phone: '008', email: 'staff@test.com', passwordHash: '$hash',
        isActive: true, role: 'STAFF',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.staffLogin('008', 'correct');

      expect(result.success).toBe(true);
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.role).toBe('STAFF');
      expect(result.user.id).toBe(1);
    });

    it('returns doctor fullName and doctorProfileId when role is DOCTOR', async () => {
      mockUsersRepo.findOne.mockResolvedValue({
        id: 2, phone: '004', email: null, passwordHash: '$hash', isActive: true, role: 'DOCTOR',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockDoctorProfilesRepo.findOne.mockResolvedValue({
        id: 10, fullName: 'BS. Nguyen Van B', userId: 2,
      });

      const result = await service.staffLogin('004', 'pass');

      expect(result.user.fullName).toBe('BS. Nguyen Van B');
      expect(result.user.doctorProfileId).toBe(10);
    });

    it('returns fallback name when DOCTOR has no profile', async () => {
      mockUsersRepo.findOne.mockResolvedValue({
        id: 3, phone: '005', email: null, passwordHash: '$hash', isActive: true, role: 'DOCTOR',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockDoctorProfilesRepo.findOne.mockResolvedValue(null);

      const result = await service.staffLogin('005', 'pass');

      expect(result.user.fullName).toBe('Bác sĩ trực ban');
      expect(result.user.doctorProfileId).toBeNull();
    });
  });

  describe('patientLogin', () => {
    it('throws UnauthorizedException when account is not found', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue(null);

      await expect(service.patientLogin('no@test.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is incorrect', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue({
        id: 1, email: 'p@test.com', passwordHash: '$hash', isActive: true, patients: [],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.patientLogin('p@test.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when account is not activated', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue({
        id: 1, email: 'p@test.com', passwordHash: '$hash', isActive: false, patients: [],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.patientLogin('p@test.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('returns token and user with fullName from "Bản thân" patient', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue({
        id: 1, email: 'p@test.com', passwordHash: '$hash', isActive: true,
        patients: [
          { fullName: 'Nguyen Van A', relationship: 'Bản thân' },
          { fullName: 'Nguyen Thi B', relationship: 'Con' },
        ],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.patientLogin('p@test.com', 'pass');

      expect(result.success).toBe(true);
      expect(result.user.role).toBe('PATIENT');
      expect(result.user.fullName).toBe('Nguyen Van A');
    });

    it('falls back to first patient when no "Bản thân" relationship', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue({
        id: 1, email: 'p@test.com', passwordHash: '$hash', isActive: true,
        patients: [{ fullName: 'Nguyen Thi C', relationship: 'Con' }],
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.patientLogin('p@test.com', 'pass');

      expect(result.user.fullName).toBe('Nguyen Thi C');
    });
  });

  describe('patientRegister', () => {
    it('throws ConflictException when email is already registered', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue({ id: 99 });

      await expect(service.patientRegister('dup@test.com', 'pass', 'Name')).rejects.toThrow(
        ConflictException,
      );
    });

    it('creates account and patient record on success', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$hashed');
      mockPatientAccountsRepo.save.mockResolvedValue({ id: 5, email: 'new@test.com' });
      mockPatientsRepo.save.mockResolvedValue({});

      const result = await service.patientRegister('new@test.com', 'pass', 'New User');

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('new@test.com');
      expect(result.user.fullName).toBe('New User');
      expect(result.user.role).toBe('PATIENT');
      expect(mockPatientsRepo.save).toHaveBeenCalledTimes(1);
    });

    it('signs a JWT token after successful registration', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$hashed');
      mockPatientAccountsRepo.save.mockResolvedValue({ id: 7, email: 'jwt@test.com' });
      mockPatientsRepo.save.mockResolvedValue({});

      const result = await service.patientRegister('jwt@test.com', 'pass', 'JWT User');

      expect(result.access_token).toBe('mock-jwt-token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 7, role: 'PATIENT' });
    });
  });

  describe('changePassword', () => {
    it('throws NotFoundException when staff user is not found', async () => {
      mockUsersRepo.findOne.mockResolvedValue(null);

      await expect(service.changePassword(1, 'STAFF', 'old', 'new')).rejects.toThrow(NotFoundException);
    });

    it('throws UnauthorizedException when old password is wrong (staff)', async () => {
      mockUsersRepo.findOne.mockResolvedValue({ id: 1, passwordHash: '$hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(1, 'STAFF', 'wrongOld', 'new')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws NotFoundException when patient account is not found', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue(null);

      await expect(service.changePassword(1, 'PATIENT', 'old', 'new')).rejects.toThrow(NotFoundException);
    });

    it('throws UnauthorizedException when old password is wrong (patient)', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue({ id: 1, passwordHash: '$hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(1, 'PATIENT', 'wrongOld', 'new')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('updates password hash and returns success', async () => {
      mockUsersRepo.findOne.mockResolvedValue({ id: 1, passwordHash: '$hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$newHash');
      mockUsersRepo.save.mockResolvedValue({});

      const result = await service.changePassword(1, 'STAFF', 'old', 'new');

      expect(result.success).toBe(true);
      expect(mockUsersRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: '$newHash' }),
      );
    });
  });
});
