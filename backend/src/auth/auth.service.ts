import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../entities/Users';
import { PatientAccounts } from '../entities/PatientAccounts';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { Patients } from '../entities/Patients';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(PatientAccounts)
    private readonly patientAccountsRepo: Repository<PatientAccounts>,
    @InjectRepository(DoctorProfiles)
    private readonly doctorProfilesRepo: Repository<DoctorProfiles>,
    @InjectRepository(Patients)
    private readonly patientsRepo: Repository<Patients>,
    private readonly jwtService: JwtService,
  ) {}

  async staffLogin(phone: string, pass: string) {
    const user = await this.usersRepo.findOne({ where: { phone } });
    if (!user || !(await bcrypt.compare(pass, user.passwordHash))) {
      throw new UnauthorizedException({ i18nKey: 'errors.auth.invalid_credentials' });
    }

    if (!user.isActive) {
      throw new UnauthorizedException({ i18nKey: 'errors.auth.account_locked' });
    }

    const normalizedRole = user.role ? user.role.toString().toUpperCase() : '';

    let fullName = 'Nhân viên lễ tân';
    if (normalizedRole === 'ADMIN') {
      fullName = 'Quản trị viên';
    }
    let doctorProfileId: number | null = null;
    if (normalizedRole === 'DOCTOR') {
      const docProfile = await this.doctorProfilesRepo.findOne({
        where: { userId: user.id },
      });
      if (docProfile) {
        fullName = docProfile.fullName;
        doctorProfileId = docProfile.id;
      } else {
        fullName = 'Bác sĩ trực ban';
      }
    }
    const payload = { id: user.id, role: normalizedRole };
    const access_token = this.jwtService.sign(payload);
    return {
      success: true,
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: normalizedRole,
        fullName,
        doctorProfileId,
      },
    };
  }

  async patientLogin(email: string, pass: string) {
    const account = await this.patientAccountsRepo.findOne({
      where: { email },
      relations: { patients: true },
    });
    if (!account || !(await bcrypt.compare(pass, account.passwordHash))) {
      throw new UnauthorizedException({ i18nKey: 'errors.auth.invalid_credentials' });
    }

    if (account.isActive == false) {
      throw new UnauthorizedException({ i18nKey: 'errors.auth.account_not_activated' });
    }

    let fullName = 'Bệnh nhân';
    const mainPatient =
      account.patients?.find((p) => p.relationship === 'Bản thân' || p.relationship === 'SELF') ||
      account.patients?.[0];
    if (mainPatient) {
      fullName = mainPatient.fullName;
    }

    const payload = { id: account.id, role: 'PATIENT' };
    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      access_token,
      user: {
        id: account.id,
        email: account.email,
        role: 'PATIENT',
        fullName,
      },
    };
  }

  async patientRegister(email: string, pass: string, name: string, dob?: string, gender?: 'MALE' | 'FEMALE') {
    const existing = await this.patientAccountsRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException({ i18nKey: 'errors.auth.email_already_registered' });
    }

    const newAccount = new PatientAccounts();
    newAccount.email = email;
    newAccount.passwordHash = await bcrypt.hash(pass, 10);
    newAccount.isActive = true;
    const savedAccount = await this.patientAccountsRepo.save(newAccount);

    const newPatient = new Patients();
    newPatient.patientAccountId = savedAccount.id;
    newPatient.fullName = name;
    newPatient.dob = dob || '1995-01-01';
    newPatient.gender = gender || 'MALE';
    newPatient.relationship = 'Bản thân';

    await this.patientsRepo.save(newPatient);

    const payload = { id: savedAccount.id, role: 'PATIENT' };
    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      access_token,
      user: {
        id: savedAccount.id,
        email: savedAccount.email,
        role: 'PATIENT',
        fullName: name,
      },
    };
  }

  async changePassword(userId: number, role: string, oldPassword: string, newPassword: string) {
    if (role === 'PATIENT') {
      const account = await this.patientAccountsRepo.findOne({ where: { id: userId } });
      if (!account) throw new NotFoundException({ i18nKey: 'errors.auth.account_not_found' });
      if (!(await bcrypt.compare(oldPassword, account.passwordHash))) {
        throw new UnauthorizedException({ i18nKey: 'errors.auth.wrong_old_password' });
      }
      account.passwordHash = await bcrypt.hash(newPassword, 10);
      await this.patientAccountsRepo.save(account);
    } else {
      const user = await this.usersRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException({ i18nKey: 'errors.auth.account_not_found' });
      if (!(await bcrypt.compare(oldPassword, user.passwordHash))) {
        throw new UnauthorizedException({ i18nKey: 'errors.auth.wrong_old_password' });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await this.usersRepo.save(user);
    }
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  }
}
