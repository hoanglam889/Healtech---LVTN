import { Appointments } from './Appointments';
import { DoctorProfiles } from './DoctorProfiles';
import { PatientAccounts } from './PatientAccounts';
export declare class Ratings {
    id: number;
    appointment_id: number;
    doctor_profile_id: number;
    patient_account_id: number;
    rating: number;
    comment: string | null;
    created_at: Date;
    appointment: Appointments;
    doctor_profile: DoctorProfiles;
    patient_account: PatientAccounts;
}
