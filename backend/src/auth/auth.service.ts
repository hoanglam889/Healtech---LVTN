import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { PatientAccounts } from '../entities/PatientAccounts';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { Patients } from '../entities/Patients';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
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

  // Đăng nhập dành cho nhân viên (STAFF) và bác sĩ (DOCTOR)
  async staffLogin(email: string, pass: string) {
    const user = await this.usersRepo.findOne({
      where: { email, passwordHash: pass },
    });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt!');
    }

    const normalizedRole = user.role ? user.role.toString().toUpperCase() : '';

    let fullName = 'Nhân viên lễ tân';
    if(normalizedRole === "ADMIN") {
      fullName = "Quản trị viên";
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

  // Đăng nhập dành cho bệnh nhân (khách hàng)
  async patientLogin(email: string, pass: string) {
    const account = await this.patientAccountsRepo.findOne({
      where: { email, passwordHash: pass },
      relations: { patients: true },
    });
    if (!account) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    if (account.isActive == false) {
      throw new UnauthorizedException('Tài khoản chưa được kích hoạt! Vui lòng xác thực mã để tiếp tục.');
    }

    // Lấy tên bệnh nhân chính của tài khoản (quan hệ Bản thân hoặc bệnh nhân đầu tiên)
    let fullName = 'Bệnh nhân';
    const mainPatient = account.patients?.find(
      (p) => p.relationship === 'Bản thân' || p.relationship === 'SELF'
    ) || account.patients?.[0];
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

  // Đăng ký tài khoản cho bệnh nhân mới
  async patientRegister(email: string, pass: string, name: string, dob?: string, gender?: 'MALE' | 'FEMALE') {
    const existing = await this.patientAccountsRepo.findOne({ where: { email } });
    if (existing) {
      return { success: false, message: 'Email này đã được đăng ký tài khoản!' };
    }

    // 1. Tạo tài khoản bệnh nhân mới
    const newAccount = new PatientAccounts();
    newAccount.email = email;
    newAccount.passwordHash = pass;
    newAccount.isActive = true;
    const savedAccount = await this.patientAccountsRepo.save(newAccount);

    // 2. Tạo hồ sơ bệnh nhân chính đi kèm (Bản thân)
    const newPatient = new Patients();
    newPatient.patientAccountId = savedAccount.id;
    newPatient.fullName = name;
    newPatient.dob = dob || '1995-01-01'; // Default ngày sinh
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
}
