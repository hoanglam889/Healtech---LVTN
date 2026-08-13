import { DoctorProfilesService } from './doctor-profiles.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
export declare class DoctorProfilesController {
    private readonly doctorProfilesService;
    constructor(doctorProfilesService: DoctorProfilesService);
    create(createDoctorProfileDto: CreateDoctorProfileDto): Promise<import("../entities/DoctorProfiles").DoctorProfiles>;
    findAll(): Promise<import("../entities/DoctorProfiles").DoctorProfiles[]>;
    findOne(id: string): Promise<import("../entities/DoctorProfiles").DoctorProfiles>;
    update(id: string, updateDoctorProfileDto: UpdateDoctorProfileDto): Promise<import("../entities/DoctorProfiles").DoctorProfiles>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
