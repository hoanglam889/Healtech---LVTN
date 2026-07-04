import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { DoctorProfiles } from 'src/entities/DoctorProfiles';
import { Users } from 'src/entities/Users';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorProfilesService {
  constructor(
    @InjectRepository(DoctorProfiles)
    private readonly doctorProfilesRepo: Repository<DoctorProfiles>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  // 1. Tạo mới Bác sĩ (Tạo User -> Tạo DoctorProfile)
  async create(dto: any) {
    const {
      phone,
      email,
      password,
      fullName,
      specialtyId,
      experienceYears,
      avatarUrl,
    } = dto;

    if (!phone || !email || !password || !fullName || !specialtyId) {
      throw new BadRequestException(
        'Vui lòng điền đầy đủ các trường bắt buộc!',
      );
    }

    // Kiểm tra trùng số điện thoại trong hệ thống
    const existingUser = await this.usersRepo.findOne({ where: { phone } });
    if (existingUser) {
      throw new BadRequestException(
        'Số điện thoại này đã được đăng ký tài khoản!',
      );
    }

    const existingEmail = await this.usersRepo.findOne({ where: { email } });
    if (existingEmail) {
      throw new BadRequestException(
        'Email này đã được đăng ký tài khoản!',
      );
    }

    // Bước A: Tạo tài khoản User đăng nhập
    const user = new Users();
    user.phone = phone;
    user.email = email;
    user.passwordHash = await bcrypt.hash(password, 10);
    user.role = 'DOCTOR';
    user.isActive = true;
    const savedUser = await this.usersRepo.save(user);

    // Bước B: Tạo thông tin hồ sơ bác sĩ
    const profile = new DoctorProfiles();
    profile.userId = savedUser.id;
    profile.specialtyId = +specialtyId;
    profile.fullName = fullName;
    profile.experienceYears = experienceYears ? +experienceYears : 0;
    profile.avatarUrl = avatarUrl || '/uploads/default-doctor.png';

    const savedProfile = await this.doctorProfilesRepo.save(profile);

    return this.findOne(savedProfile.id);
  }

  // 2. Lấy tất cả bác sĩ hoạt động
  findAll() {
    return this.doctorProfilesRepo.find({
      relations: {
        specialty: true,
        doctorSchedules: {
          shift: true,
        },
        user: true,
      },
    });
  }

  // 3. Lấy 1 bác sĩ
  async findOne(id: number) {
    const profile = await this.doctorProfilesRepo.findOne({
      where: { id },
      relations: {
        specialty: true,
        doctorSchedules: {
          shift: true,
        },
        user: true,
      },
    });
    if (!profile) {
      throw new NotFoundException(`Không tìm thấy hồ sơ bác sĩ #${id}`);
    }
    return profile;
  }

  // 4. Cập nhật thông tin bác sĩ
  async update(id: number, dto: any) {
    const profile = await this.findOne(id);
    const {
      phone,
      email,
      password,
      fullName,
      specialtyId,
      experienceYears,
      avatarUrl,
    } = dto;

    // Cập nhật tài khoản User đi kèm nếu có gửi phone/password
    if (profile.userId) {
      const userUpdate: any = {};
      if (phone) {
        // Kiểm tra xem số điện thoại mới có bị trùng với người khác không
        const existing = await this.usersRepo.findOne({ where: { phone } });
        if (existing && existing.id !== profile.userId) {
          throw new BadRequestException(
            'Số điện thoại này đã tồn tại trên hệ thống!',
          );
        }
        userUpdate.phone = phone;
      }
      if (email) {
        const existingEmail = await this.usersRepo.findOne({ where: { email } });
        if (existingEmail && existingEmail.id !== profile.userId) {
          throw new BadRequestException(
            'Email này đã tồn tại trên hệ thống!',
          );
        }
        userUpdate.email = email;
      }
      if (password) {
        userUpdate.passwordHash = await bcrypt.hash(password, 10);
      }
      if (dto.isActive !== undefined) {
        userUpdate.isActive = dto.isActive;
      }
      if (Object.keys(userUpdate).length > 0) {
        await this.usersRepo.update(profile.userId, userUpdate);
      }
    }

    // Cập nhật thông tin hồ sơ
    const profileUpdate: any = {};
    if (fullName) profileUpdate.fullName = fullName;
    if (specialtyId) profileUpdate.specialtyId = +specialtyId;
    if (experienceYears !== undefined)
      profileUpdate.experienceYears = +experienceYears;
    if (avatarUrl) profileUpdate.avatarUrl = avatarUrl;

    if (Object.keys(profileUpdate).length > 0) {
      await this.doctorProfilesRepo.update(id, profileUpdate);
    }

    return this.findOne(id);
  }

  // 5. Khóa tài khoản bác sĩ (Soft Delete để bảo vệ dữ liệu lịch khám)
  async remove(id: number) {
    const profile = await this.findOne(id);
    if (profile.userId) {
      await this.usersRepo.update(profile.userId, { isActive: false });
    }
    return {
      success: true,
      message: `Đã khóa tài khoản bác sĩ #${id} thành công`,
    };
  }
}
