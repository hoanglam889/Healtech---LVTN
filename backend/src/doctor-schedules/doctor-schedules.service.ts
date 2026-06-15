import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorSchedules } from '../entities/DoctorSchedules';

export class CreateDoctorScheduleDto {
  doctorProfileId: number;
  shiftId: number;
  date: string;
  maxPatients?: number;
}

@Injectable()
export class DoctorSchedulesService {
  constructor(
    @InjectRepository(DoctorSchedules)
    private schedulesRepo: Repository<DoctorSchedules>,
  ) {}

  findAll(doctorProfileId?: number) {
    return this.schedulesRepo.find({
      where: doctorProfileId ? { doctorProfileId } : {},
      relations: { shift: true, doctorProfile: { specialty: true } },
      order: { date: 'ASC' },
    });
  }

  async create(dto: CreateDoctorScheduleDto) {
    const schedule = this.schedulesRepo.create(dto);
    return this.schedulesRepo.save(schedule);
  }

  async remove(id: number) {
    const schedule = await this.schedulesRepo.findOne({ where: { id } });
    if (!schedule) throw new NotFoundException(`Không tìm thấy lịch trực #${id}`);
    await this.schedulesRepo.remove(schedule);
    return { success: true, message: `Đã xóa lịch trực #${id}` };
  }
}
