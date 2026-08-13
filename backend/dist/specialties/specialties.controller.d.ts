import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
export declare class SpecialtiesController {
    private readonly specialtiesService;
    constructor(specialtiesService: SpecialtiesService);
    create(createSpecialtyDto: CreateSpecialtyDto): Promise<import("../entities/Specialties").Specialties>;
    findAll(): Promise<import("../entities/Specialties").Specialties[]>;
    findOne(id: string): Promise<import("../entities/Specialties").Specialties>;
    update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<import("../entities/Specialties").Specialties>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
