import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Repository } from 'typeorm';
import { Specialties } from "../entities/Specialties";
export declare class SpecialtiesService {
    private specialtiesRepository;
    constructor(specialtiesRepository: Repository<Specialties>);
    create(createSpecialtyDto: CreateSpecialtyDto): Promise<Specialties>;
    findAll(): Promise<Specialties[]>;
    findOne(id: number): Promise<Specialties>;
    update(id: number, updateSpecialtyDto: UpdateSpecialtyDto): Promise<Specialties>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
