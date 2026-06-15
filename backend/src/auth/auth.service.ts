import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../entities/Users';
import { PatientAccounts } from '../entities/PatientAccounts';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { Patients } from '../entities/Patients';

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
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không chính xác!');
    }

    const normalizedRole = user.role ? user.role.toString().toUpperCase() : '';

    let fullName = 'Nhân viên lễ tân';
    let doctorProfileId: number | null = null;
    if (normalizedRole === 'DOCTOR') {
      const docProfile = await this.doctorProfilesRepo.findOne({ where: { userId: user.id } });
      if (docProfile) {
        fullName = docProfile.fullName;
        doctorProfileId = docProfile.id;
      } else {
        fullName = 'Bác sĩ trực ban';
      }
    }

    const payload = { sub: user.id, role: normalizedRole };
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, phone: user.phone, role: normalizedRole, fullName, doctorProfileId },
    };
  }

  async patientLogin(phone: string, pass: string) {
    const account = await this.patientAccountsRepo.findOne({
      where: { phone },
      relations: { patients: true },
    });
    if (!account || !(await bcrypt.compare(pass, account.passwordHash))) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không chính xác!');
    }

    let fullName = 'Bệnh nhân';
    const mainPatient =
      account.patients?.find((p) => p.relationship === 'Bản thân' || p.relationship === 'SELF') ||
      account.patients?.[0];
    if (mainPatient) fullName = mainPatient.fullName;

    const payload = { sub: account.id, role: 'PATIENT' };
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: { id: account.id, phone: account.phone, role: 'PATIENT', fullName },
    };
  }

  async patientRegister(phone: string, pass: string, name: string, dob?: string, gender?: 'MALE' | 'FEMALE') {
    const existing = await this.patientAccountsRepo.findOne({ where: { phone } });
    if (existing) {
      return { success: false, message: 'Số điện thoại này đã được đăng ký tài khoản!' };
    }

    const newAccount = new PatientAccounts();
    newAccount.phone = phone;
    newAccount.passwordHash = await bcrypt.hash(pass, 10);
    newAccount.isActive = true;
    const savedAccount = await this.patientAccountsRepo.save(newAccount);

    const newPatient = new Patients();
    newPatient.patientAccountId = savedAccount.id;
    newPatient.fullName = name;
    newPatient.dob = dob || '1995-01-01';
    newPatient.gender = gender || 'MALE';
    newPatient.phone = phone;
    newPatient.relationship = 'Bản thân';
    await this.patientsRepo.save(newPatient);

    const payload = { sub: savedAccount.id, role: 'PATIENT' };
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: { id: savedAccount.id, phone: savedAccount.phone, role: 'PATIENT', fullName: name },
    };
  }

  async changePassword(accountId: number, role: string, oldPass: string, newPass: string) {
    if (role === 'PATIENT') {
      const account = await this.patientAccountsRepo.findOne({ where: { id: accountId } });
      if (!account || !(await bcrypt.compare(oldPass, account.passwordHash))) {
        throw new UnauthorizedException('Mật khẩu cũ không chính xác!');
      }
      account.passwordHash = await bcrypt.hash(newPass, 10);
      await this.patientAccountsRepo.save(account);
    } else {
      const user = await this.usersRepo.findOne({ where: { id: accountId } });
      if (!user || !(await bcrypt.compare(oldPass, user.passwordHash))) {
        throw new UnauthorizedException('Mật khẩu cũ không chính xác!');
      }
      user.passwordHash = await bcrypt.hash(newPass, 10);
      await this.usersRepo.save(user);
    }
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  }
}
