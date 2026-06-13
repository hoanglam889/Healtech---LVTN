import { Injectable } from '@nestjs/common';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { DoctorProfiles } from 'src/entities/DoctorProfiles';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class DoctorProfilesService {
  constructor(
    @InjectRepository(DoctorProfiles)
    private DoctorProfiles: Repository<DoctorProfiles>
  ) {}
  create(createDoctorProfileDto: CreateDoctorProfileDto) {
    return 'This action adds a new doctorProfile';
  }

  findAll() {
    return this.DoctorProfiles.find({
      relations: {
        specialty: true,
        doctorSchedules: {
          shift: true,
        },
      },
    });
  }

  findOne(id: number) {
    return this.DoctorProfiles.findOne({
      where: { id },
      relations: {
        specialty: true,
        doctorSchedules: {
          shift: true,
        },
      },
    });
  }

  update(id: number, updateDoctorProfileDto: UpdateDoctorProfileDto) {
    return `This action updates a #${id} doctorProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorProfile`;
  }
}
