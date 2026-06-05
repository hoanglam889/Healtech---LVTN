import { Injectable } from '@nestjs/common';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Repository } from 'typeorm';
import { Specialties } from 'src/entities/Specialties';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialties)
    private specialtiesRepository: Repository<Specialties>
  ) {}
  create(createSpecialtyDto: CreateSpecialtyDto) {
    return 'This action adds a new specialty';
  }

  findAll() {
    return this.specialtiesRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} specialty`;
  }

  update(id: number, updateSpecialtyDto: UpdateSpecialtyDto) {
    return `This action updates a #${id} specialty`;
  }

  remove(id: number) {
    return `This action removes a #${id} specialty`;
  }
}
