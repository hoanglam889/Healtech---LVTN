import { Repository } from 'typeorm';
import { Specialties } from '../entities/Specialties';
import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private specialtiesRepo;
    private configService;
    private genAI;
    constructor(specialtiesRepo: Repository<Specialties>, configService: ConfigService);
    recommendSpecialties(symptoms: string): Promise<any>;
}
