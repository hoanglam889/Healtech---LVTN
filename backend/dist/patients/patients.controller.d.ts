import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(createPatientDto: CreatePatientDto): Promise<import("../entities/Patients").Patients>;
    findAll(patientAccountId?: string): Promise<import("../entities/Patients").Patients[]>;
    findOne(id: string): Promise<import("../entities/Patients").Patients>;
    update(id: string, updatePatientDto: UpdatePatientDto): Promise<import("../entities/Patients").Patients>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
