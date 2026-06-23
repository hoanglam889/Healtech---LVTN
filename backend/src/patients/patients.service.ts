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
    const isCompleted = !!(
      createPatientDto.fullName &&
      createPatientDto.dob &&
      createPatientDto.cccd &&
      createPatientDto.address &&
      createPatientDto.gender &&
      createPatientDto.phone
    );

    const newPatient = this.patientsRepository.create({ ...createPatientDto, isCompleted });
    return await this.patientsRepository.save(newPatient);
  }

  async findAll(patientAccountId?: number) {
    return await this.patientsRepository.find({
      where: patientAccountId ? { patientAccountId } : {},
    });
  }

  async search(query: string) {
    return await this.patientsRepository
      .createQueryBuilder('p')
      .where('p.fullName LIKE :q OR p.phone LIKE :q OR p.cccd LIKE :q', { q: `%${query}%` })
      .orderBy('p.createdAt', 'DESC')
      .take(20)
      .getMany();
  }

  async findOne(id: number) {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException({ i18nKey: 'errors.patient.not_found', args: { id } });
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.findOne(id);

    const mergedData = { ...patient, ...updatePatientDto };
    const isCompleted = !!(
      mergedData.fullName &&
      mergedData.dob &&
      mergedData.cccd &&
      mergedData.address &&
      mergedData.gender &&
      mergedData.phone
    );

    await this.patientsRepository.update(id, { ...updatePatientDto, isCompleted });
    return this.findOne(id);
  }

  async remove(id: number) {
    const patient = await this.findOne(id);
    await this.patientsRepository.remove(patient);
    return { success: true };
  }
}
