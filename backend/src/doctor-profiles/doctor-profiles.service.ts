import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { DoctorProfiles } from '../entities/DoctorProfiles';

@Injectable()
export class DoctorProfilesService {
  constructor(
    @InjectRepository(DoctorProfiles)
    private doctorProfilesRepo: Repository<DoctorProfiles>,
  ) {}

  async create(createDoctorProfileDto: CreateDoctorProfileDto) {
    const profile = this.doctorProfilesRepo.create(createDoctorProfileDto);
    return this.doctorProfilesRepo.save(profile);
  }

  findAll() {
    return this.doctorProfilesRepo.find({
      relations: {
        specialty: true,
        doctorSchedules: { shift: true },
      },
    });
  }

  async findOne(id: number) {
    const profile = await this.doctorProfilesRepo.findOne({
      where: { id },
      relations: {
        specialty: true,
        doctorSchedules: { shift: true },
      },
    });
    if (!profile) throw new NotFoundException(`Không tìm thấy bác sĩ có ID #${id}`);
    return profile;
  }

  async update(id: number, updateDoctorProfileDto: UpdateDoctorProfileDto) {
    await this.findOne(id);
    await this.doctorProfilesRepo.update(id, updateDoctorProfileDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    await this.doctorProfilesRepo.remove(profile);
    return { success: true, message: `Đã xóa hồ sơ bác sĩ #${id}` };
  }
}
