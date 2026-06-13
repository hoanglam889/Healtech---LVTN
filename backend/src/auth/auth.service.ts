import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  // Đăng nhập dành cho nhân viên (STAFF) và bác sĩ (DOCTOR)
  async staffLogin(phone: string, pass: string) {
    const user = await this.usersRepo.findOne({
      where: { phone, passwordHash: pass },
    });
    if (!user) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không chính xác!');
    }

    const normalizedRole = user.role ? user.role.toString().toUpperCase() : '';

    let fullName = 'Nhân viên lễ tân';
    if (normalizedRole === 'DOCTOR') {
      const docProfile = await this.doctorProfilesRepo.findOne({
        where: { userId: user.id },
      });
      if (docProfile) {
        fullName = docProfile.fullName;
      } else {
        fullName = 'Bác sĩ trực ban';
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        role: normalizedRole,
        fullName,
      },
    };
  }

  // Đăng nhập dành cho bệnh nhân (khách hàng)
  async patientLogin(phone: string, pass: string) {
    const account = await this.patientAccountsRepo.findOne({
      where: { phone, passwordHash: pass },
      relations: { patients: true },
    });
    if (!account) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không chính xác!');
    }

    // Lấy tên bệnh nhân chính của tài khoản (quan hệ Bản thân hoặc bệnh nhân đầu tiên)
    let fullName = 'Bệnh nhân';
    const mainPatient = account.patients?.find(
      (p) => p.relationship === 'Bản thân' || p.relationship === 'SELF'
    ) || account.patients?.[0];
    if (mainPatient) {
      fullName = mainPatient.fullName;
    }

    return {
      success: true,
      user: {
        id: account.id,
        phone: account.phone,
        role: 'PATIENT',
        fullName,
      },
    };
  }

  // Đăng ký tài khoản cho bệnh nhân mới
  async patientRegister(phone: string, pass: string, name: string, dob?: string, gender?: 'MALE' | 'FEMALE') {
    const existing = await this.patientAccountsRepo.findOne({ where: { phone } });
    if (existing) {
      return { success: false, message: 'Số điện thoại này đã được đăng ký tài khoản!' };
    }

    // 1. Tạo tài khoản bệnh nhân mới
    const newAccount = new PatientAccounts();
    newAccount.phone = phone;
    newAccount.passwordHash = pass;
    newAccount.isActive = true;
    const savedAccount = await this.patientAccountsRepo.save(newAccount);

    // 2. Tạo hồ sơ bệnh nhân chính đi kèm (Bản thân)
    const newPatient = new Patients();
    newPatient.patientAccountId = savedAccount.id;
    newPatient.fullName = name;
    newPatient.dob = dob || '1995-01-01'; // Default ngày sinh
    newPatient.gender = gender || 'MALE';
    newPatient.phone = phone;
    newPatient.relationship = 'Bản thân';

    await this.patientsRepo.save(newPatient);

    return {
      success: true,
      user: {
        id: savedAccount.id,
        phone: savedAccount.phone,
        role: 'PATIENT',
        fullName: name,
      },
    };
  }
}
