import { Appointments } from './Appointments';
import { PatientAccounts } from './PatientAccounts';
export declare class Patients {
    id: number;
    patientAccountId: number | null;
    relationship: string | null;
    cccd: string | null;
    fullName: string;
    dob: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string | null;
    address: string | null;
    isCompleted: boolean;
    createdAt: Date;
    appointments: Appointments[];
    patientAccount: PatientAccounts;
}
