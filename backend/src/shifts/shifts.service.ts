import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shifts } from '../entities/Shifts';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shifts)
    private shiftsRepo: Repository<Shifts>,
  ) {}

  findAll() {
    return this.shiftsRepo.find({ order: { startTime: 'ASC' } });
  }
}
