import { AppointmentStatusLogs } from './AppointmentStatusLogs';
import { DoctorProfiles } from './DoctorProfiles';
import { Articles } from './Articles';
export declare class Users {
    id: number;
    phone: string;
    email: string | null;
    passwordHash: string;
    role: 'ADMIN' | 'DOCTOR' | 'STAFF';
    isActive: boolean | null;
    createdAt: Date;
    appointmentStatusLogs: AppointmentStatusLogs[];
    doctorProfiles: DoctorProfiles;
    articles: Articles[];
}
