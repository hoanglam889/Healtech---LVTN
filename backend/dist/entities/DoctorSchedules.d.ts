import { DoctorProfiles } from './DoctorProfiles';
import { Shifts } from './Shifts';
export declare class DoctorSchedules {
    id: number;
    doctorProfileId: number;
    shiftId: number;
    date: string;
    maxPatients: number | null;
    createdAt: Date;
    doctorProfile: DoctorProfiles;
    shift: Shifts;
}
