import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Services } from '../entities/Services';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services)
    private servicesRepo: Repository<Services>,
  ) {}
  async create(createServiceDto: CreateServiceDto) {
    const newService = this.servicesRepo.create(createServiceDto);
    return await this.servicesRepo.save(newService);
  }

  async findAll() {
    return this.servicesRepo.find({ where: { isActive: true } });
  }

  async findOne(id: number) {
    return this.servicesRepo.findOne({
      where: {
        id: id,
        isActive: true,
      },
    });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    await this.servicesRepo.update(id, updateServiceDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.servicesRepo.update(id, { isActive: false });
    return { message: 'Đã ngưng sử dụng dịch vụ này' };
  }
}
