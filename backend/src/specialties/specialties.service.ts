import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Specialties } from '../entities/Specialties';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialties)
    private specialtiesRepository: Repository<Specialties>,
  ) {}

  async create(createSpecialtyDto: CreateSpecialtyDto) {
    const specialty = this.specialtiesRepository.create(createSpecialtyDto);
    return this.specialtiesRepository.save(specialty);
  }

  findAll() {
    return this.specialtiesRepository.find();
  }

  async findOne(id: number) {
    const specialty = await this.specialtiesRepository.findOne({ where: { id } });
    if (!specialty) throw new NotFoundException(`Không tìm thấy chuyên khoa có ID #${id}`);
    return specialty;
  }

  async update(id: number, updateSpecialtyDto: UpdateSpecialtyDto) {
    await this.findOne(id);
    await this.specialtiesRepository.update(id, updateSpecialtyDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const specialty = await this.findOne(id);
    await this.specialtiesRepository.remove(specialty);
    return { success: true, message: `Đã xóa chuyên khoa #${id}` };
  }
}
