import { DoctorProfiles } from "../entities/DoctorProfiles";
import { Users } from "../entities/Users";
import { Repository } from 'typeorm';
export declare class DoctorProfilesService {
    private readonly doctorProfilesRepo;
    private readonly usersRepo;
    constructor(doctorProfilesRepo: Repository<DoctorProfiles>, usersRepo: Repository<Users>);
    create(dto: any): Promise<DoctorProfiles>;
    findAll(): Promise<DoctorProfiles[]>;
    findOne(id: number): Promise<DoctorProfiles>;
    update(id: number, dto: any): Promise<DoctorProfiles>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
