import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Repository } from 'typeorm';
import { Patients } from '../entities/Patients';
export declare class PatientsService {
    private readonly patientsRepository;
    constructor(patientsRepository: Repository<Patients>);
    create(createPatientDto: CreatePatientDto): Promise<Patients>;
    findAll(patientAccountId?: number): Promise<Patients[]>;
    findOne(id: number): Promise<Patients>;
    update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patients>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
