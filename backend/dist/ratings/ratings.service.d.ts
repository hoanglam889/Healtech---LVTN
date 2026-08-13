import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Ratings } from '../entities/Ratings';
import { Repository } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { DoctorProfiles } from '../entities/DoctorProfiles';
export declare class RatingsService {
    private readonly ratingsRepository;
    private appointmentsRepo;
    private doctorProfilesRepo;
    constructor(ratingsRepository: Repository<Ratings>, appointmentsRepo: Repository<Appointments>, doctorProfilesRepo: Repository<DoctorProfiles>);
    create(createRatingDto: CreateRatingDto): Promise<{
        success: boolean;
        message: string;
        data: Ratings;
    }>;
    findAll(doctorId?: number): Promise<Ratings[]>;
    findOne(id: number): Promise<Ratings>;
    update(id: number, updateRatingDto: UpdateRatingDto): string;
    remove(id: number): string;
}
