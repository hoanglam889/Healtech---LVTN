import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patients } from '../entities/Patients';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private readonly patientsRepository: Repository<Patients>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const newPatient = this.patientsRepository.create(createPatientDto);
    return await this.patientsRepository.save(newPatient);
  }

  async findAll(patientAccountId?: number) {
    return await this.patientsRepository.find({
      where: patientAccountId ? { patientAccountId } : {}
    });
  }

  async findOne(id: number) {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Không tìm thấy bệnh nhân với ID: ${id}`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    await this.patientsRepository.update(id, updatePatientDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const patient = await this.findOne(id);
    await this.patientsRepository.remove(patient);
    return { success: true };
  }
}
