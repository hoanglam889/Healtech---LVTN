import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Services } from '../entities/Services';
import { Repository } from 'typeorm';
export declare class ServicesService {
    private servicesRepo;
    constructor(servicesRepo: Repository<Services>);
    create(createServiceDto: CreateServiceDto): Promise<Services>;
    findAll(): Promise<Services[]>;
    findOne(id: number): Promise<Services | null>;
    update(id: number, updateServiceDto: UpdateServiceDto): Promise<Services | null>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
