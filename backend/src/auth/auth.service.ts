import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { PatientAccounts } from '../entities/PatientAccounts';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { Patients } from '../entities/Patients';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
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
    private readonly mailService: MailService,
  ) {}

  // Đăng nhập dành cho nhân viên (STAFF) và bác sĩ (DOCTOR)
  async staffLogin(email: string, pass: string) {
    const user = await this.usersRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    const isMatch = user.passwordHash.startsWith('$2')
      ? await bcrypt.compare(pass, user.passwordHash)
      : user.passwordHash === pass;

    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt!',
      );
    }

    const normalizedRole = user.role ? user.role.toString().toUpperCase() : '';

    let fullName = 'Nhân viên lễ tân';
    if (normalizedRole === 'ADMIN') {
      fullName = 'Quản trị viên';
    }
    let doctorProfileId: number | null = null;
    let avatarUrl: string | null = null;
    if (normalizedRole === 'DOCTOR') {
      const docProfile = await this.doctorProfilesRepo.findOne({
        where: { userId: user.id },
      });
      if (docProfile) {
        fullName = docProfile.fullName;
        doctorProfileId = docProfile.id;
        avatarUrl = docProfile.avatarUrl;
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
        avatarUrl,
      },
    };
  }

  // Đăng nhập dành cho bệnh nhân (khách hàng)
  async patientLogin(email: string, pass: string) {
    const account = await this.patientAccountsRepo.findOne({
      where: { email },
      relations: { patients: true },
    });
    if (!account) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    const isMatch = account.passwordHash.startsWith('$2')
      ? await bcrypt.compare(pass, account.passwordHash)
      : account.passwordHash === pass;

    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác!');
    }

    if (account.isActive == false) {
      throw new UnauthorizedException(
        'Tài khoản chưa được kích hoạt! Vui lòng xác thực mã để tiếp tục.',
      );
    }

    // Lấy tên bệnh nhân chính của tài khoản (quan hệ Bản thân hoặc bệnh nhân đầu tiên)
    let fullName = 'Bệnh nhân';
    const mainPatient =
      account.patients?.find(
        (p) => p.relationship === 'Bản thân' || p.relationship === 'SELF',
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

  // Đăng ký tài khoản cho bệnh nhân mới (Gửi mã OTP)
  async patientRegister(
    email: string,
    pass: string,
    name: string,
    dob?: string,
    gender?: 'MALE' | 'FEMALE',
  ) {
    const existing = await this.patientAccountsRepo.findOne({
      where: { email },
    });
    if (existing) {
      if (existing.isActive) {
        return {
          success: false,
          message: 'Email này đã được đăng ký tài khoản!',
        };
      } else {
        // Tài khoản tồn tại nhưng chưa kích hoạt, cập nhật lại mã OTP mới
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        existing.otpCode = otp;
        existing.passwordHash = pass; // Cập nhật pass mới
        await this.patientAccountsRepo.save(existing);

        // Gửi mail
        this.mailService
          .sendRegisterOTP(email, otp)
          .catch((e) => console.error(e));

        return {
          success: true,
          requireOtp: true,
          email: email,
          message: 'Mã xác thực mới đã được gửi đến email của bạn.',
        };
      }
    }

    // 1. Tạo tài khoản bệnh nhân mới
    const newAccount = new PatientAccounts();
    newAccount.email = email;
    newAccount.passwordHash = await bcrypt.hash(pass, 10);
    newAccount.isActive = false; // Đợi OTP mới được kích hoạt
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newAccount.otpCode = otp;
    const savedAccount = await this.patientAccountsRepo.save(newAccount);

    // 2. Tạo hồ sơ bệnh nhân chính đi kèm (Bản thân)
    const newPatient = new Patients();
    newPatient.patientAccountId = savedAccount.id;
    newPatient.fullName = name;
    newPatient.dob = dob || '1995-01-01'; // Default ngày sinh
    newPatient.gender = gender || 'MALE';
    newPatient.relationship = 'Bản thân';

    await this.patientsRepo.save(newPatient);

    // 3. Gửi mail OTP
    this.mailService.sendRegisterOTP(email, otp).catch((e) => console.error(e));

    return {
      success: true,
      requireOtp: true,
      email: email,
      message: 'Vui lòng kiểm tra email để lấy mã xác thực OTP.',
    };
  }

  // Xác thực mã OTP
  async patientVerifyOtp(email: string, otpCode: string) {
    const account = await this.patientAccountsRepo.findOne({
      where: { email },
    });
    if (!account) {
      throw new UnauthorizedException('Tài khoản không tồn tại!');
    }

    if (account.isActive) {
      return {
        success: false,
        message: 'Tài khoản này đã được xác thực trước đó.',
      };
    }

    if (account.otpCode !== otpCode) {
      throw new UnauthorizedException('Mã xác thực không chính xác!');
    }

    // Xác thực thành công
    account.isActive = true;
    account.otpCode = null;
    await this.patientAccountsRepo.save(account);

    const payload = { id: account.id, role: 'PATIENT' };
    const access_token = this.jwtService.sign(payload);

    // Tìm thông tin bệnh nhân (Bản thân)
    const primaryPatient = await this.patientsRepo.findOne({
      where: { patientAccountId: account.id, relationship: 'Bản thân' },
    });

    return {
      success: true,
      access_token,
      user: {
        id: account.id,
        email: account.email,
        role: 'PATIENT',
        fullName: primaryPatient ? primaryPatient.fullName : 'Bệnh nhân',
      },
    };
  }

  // Cập nhật thông tin tài khoản (Email, Mật khẩu)
  async updatePatientAccount(accountId: number, updateDto: { email?: string, oldPassword?: string, newPassword?: string }) {
    const account = await this.patientAccountsRepo.findOne({ where: { id: accountId } });
    if (!account) {
      throw new UnauthorizedException('Không tìm thấy tài khoản');
    }

    if (updateDto.email) {
      // Check duplicate email
      const existingEmail = await this.patientAccountsRepo.findOne({ where: { email: updateDto.email } });
      if (existingEmail && existingEmail.id !== accountId) {
        throw new UnauthorizedException('Email này đã được sử dụng bởi tài khoản khác');
      }
      account.email = updateDto.email;
    }

    if (updateDto.oldPassword && updateDto.newPassword) {
      const isMatch = account.passwordHash.startsWith('$2')
        ? await bcrypt.compare(updateDto.oldPassword, account.passwordHash)
        : account.passwordHash === updateDto.oldPassword;

      if (!isMatch) {
        throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
      }
      account.passwordHash = await bcrypt.hash(updateDto.newPassword, 10);
    }

    await this.patientAccountsRepo.save(account);
    return {
      success: true,
      message: 'Cập nhật tài khoản thành công',
      user: {
        id: account.id,
        email: account.email,
        phone: account.phone,
      }
    };
  }

  // Khôi phục mật khẩu - Bước 1: Gửi OTP
  async forgotPassword(email: string) {
    const account = await this.patientAccountsRepo.findOne({ where: { email } });
    if (!account) {
      throw new UnauthorizedException('Không tìm thấy tài khoản với email này!');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    account.otpCode = otp;
    await this.patientAccountsRepo.save(account);

    this.mailService.sendForgotPasswordOTP(email, otp).catch((e) => console.error(e));

    return {
      success: true,
      message: 'Mã xác minh đã được gửi đến email của bạn.',
    };
  }

  // Khôi phục mật khẩu - Bước 2: Xác minh OTP
  async verifyResetOtp(email: string, otpCode: string) {
    const account = await this.patientAccountsRepo.findOne({ where: { email } });
    if (!account) {
      throw new UnauthorizedException('Không tìm thấy tài khoản!');
    }

    if (account.otpCode !== otpCode) {
      throw new UnauthorizedException('Mã xác thực không chính xác!');
    }

    return { success: true, message: 'Mã hợp lệ. Vui lòng nhập mật khẩu mới.' };
  }

  // Khôi phục mật khẩu - Bước 3: Đặt lại mật khẩu
  async resetPassword(email: string, otpCode: string, newPassword: string) {
    const account = await this.patientAccountsRepo.findOne({ where: { email } });
    if (!account) {
      throw new UnauthorizedException('Không tìm thấy tài khoản!');
    }

    if (account.otpCode !== otpCode) {
      throw new UnauthorizedException('Mã xác thực không chính xác!');
    }

    account.passwordHash = await bcrypt.hash(newPassword, 10);
    account.otpCode = null;
    await this.patientAccountsRepo.save(account);

    return { success: true, message: 'Đổi mật khẩu thành công!' };
  }
}
