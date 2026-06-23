import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, I18nValidationPipe, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import cookieParser from 'cookie-parser';

import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';
import { Users } from '../src/entities/Users';
import { PatientAccounts } from '../src/entities/PatientAccounts';
import { DoctorProfiles } from '../src/entities/DoctorProfiles';
import { Patients } from '../src/entities/Patients';

const TEST_JWT_SECRET = 'test-secret-for-e2e';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  const mockUsersRepo = { findOne: jest.fn(), save: jest.fn() };
  const mockPatientAccountsRepo = { findOne: jest.fn(), save: jest.fn() };
  const mockDoctorProfilesRepo = { findOne: jest.fn() };
  const mockPatientsRepo = { save: jest.fn() };

  beforeAll(async () => {
    process.env.JWT_SECRET = TEST_JWT_SECRET;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true }),
        I18nModule.forRoot({
          fallbackLanguage: 'vi',
          loaderOptions: {
            path: path.join(__dirname, '../src/i18n/'),
            watch: false,
          },
          resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
        }),
        PassportModule,
        JwtModule.register({
          secret: TEST_JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
        {
          provide: APP_PIPE,
          useFactory: () => new I18nValidationPipe({ whitelist: true, transform: true }),
        },
        { provide: getRepositoryToken(Users), useValue: mockUsersRepo },
        { provide: getRepositoryToken(PatientAccounts), useValue: mockPatientAccountsRepo },
        { provide: getRepositoryToken(DoctorProfiles), useValue: mockDoctorProfilesRepo },
        { provide: getRepositoryToken(Patients), useValue: mockPatientsRepo },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/staff-login', () => {
    it('returns 400 with standard error shape when fields are missing', () => {
      return request(app.getHttpServer())
        .post('/auth/staff-login')
        .set('Accept-Language', 'vi')
        .send({ phone: '008' })
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            statusCode: 400,
            error: 'BAD_REQUEST',
          });
          expect(typeof res.body.message).toBe('string');
          expect(res.body.timestamp).toBeDefined();
          expect(res.body.path).toBe('/auth/staff-login');
        });
    });

    it('returns 401 with standard error shape when credentials are invalid', () => {
      mockUsersRepo.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .post('/auth/staff-login')
        .set('Accept-Language', 'vi')
        .send({ phone: '000', password: 'wrong' })
        .expect(401)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            statusCode: 401,
            error: 'UNAUTHORIZED',
            errors: null,
          });
          expect(typeof res.body.message).toBe('string');
          expect(res.body.path).toBe('/auth/staff-login');
        });
    });

    it('returns 200 with user data on successful login', async () => {
      const passwordHash = await bcrypt.hash('1', 10);
      mockUsersRepo.findOne.mockResolvedValue({
        id: 1, phone: '008', email: 'staff@test.com',
        passwordHash, isActive: true, role: 'STAFF',
      });

      return request(app.getHttpServer())
        .post('/auth/staff-login')
        .send({ phone: '008', password: '1' })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.user.role).toBe('STAFF');
          expect(res.body.user.id).toBe(1);
        });
    });

    it('returns 401 with translated Vietnamese message for invalid credentials', () => {
      mockUsersRepo.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .post('/auth/staff-login')
        .set('Accept-Language', 'vi')
        .send({ phone: '000', password: 'wrong' })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe(
            'Số điện thoại/email hoặc mật khẩu không chính xác',
          );
        });
    });
  });

  describe('POST /auth/patient-login', () => {
    it('returns 400 when both fields are missing', () => {
      return request(app.getHttpServer())
        .post('/auth/patient-login')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.statusCode).toBe(400);
        });
    });

    it('returns 401 when credentials are wrong', () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .post('/auth/patient-login')
        .send({ email: 'no@test.com', password: 'wrong' })
        .expect(401)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.error).toBe('UNAUTHORIZED');
        });
    });

    it('returns 401 when account is not activated', async () => {
      const passwordHash = await bcrypt.hash('pass', 10);
      mockPatientAccountsRepo.findOne.mockResolvedValue({
        id: 1, email: 'inactive@test.com', passwordHash, isActive: false, patients: [],
      });

      return request(app.getHttpServer())
        .post('/auth/patient-login')
        .send({ email: 'inactive@test.com', password: 'pass' })
        .expect(401)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.statusCode).toBe(401);
        });
    });

    it('returns 200 with user data on success', async () => {
      const passwordHash = await bcrypt.hash('pass', 10);
      mockPatientAccountsRepo.findOne.mockResolvedValue({
        id: 2, email: 'patient@test.com', passwordHash, isActive: true,
        patients: [{ fullName: 'Nguyen Van A', relationship: 'Bản thân' }],
      });

      return request(app.getHttpServer())
        .post('/auth/patient-login')
        .send({ email: 'patient@test.com', password: 'pass' })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.user.role).toBe('PATIENT');
          expect(res.body.user.fullName).toBe('Nguyen Van A');
        });
    });
  });

  describe('POST /auth/patient-register', () => {
    it('returns 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/auth/patient-register')
        .send({ email: 'test@test.com' })
        .expect(400)
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.statusCode).toBe(400);
        });
    });

    it('returns 409 when email is already registered', () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue({ id: 99 });

      return request(app.getHttpServer())
        .post('/auth/patient-register')
        .set('Accept-Language', 'vi')
        .send({ email: 'dup@test.com', password: 'pass', fullName: 'User' })
        .expect(409)
        .expect((res) => {
          expect(res.body).toMatchObject({
            success: false,
            statusCode: 409,
            error: 'CONFLICT',
          });
          expect(res.body.message).toBe('Email này đã được đăng ký tài khoản');
        });
    });

    it('returns 201 with user data on successful registration', async () => {
      mockPatientAccountsRepo.findOne.mockResolvedValue(null);
      mockPatientAccountsRepo.save.mockResolvedValue({ id: 5, email: 'new@test.com' });
      mockPatientsRepo.save.mockResolvedValue({});

      return request(app.getHttpServer())
        .post('/auth/patient-register')
        .send({ email: 'new@test.com', password: 'pass', fullName: 'New User' })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.user.email).toBe('new@test.com');
          expect(res.body.user.role).toBe('PATIENT');
        });
    });
  });
});
