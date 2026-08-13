import { Appointments } from './Appointments';
import { Users } from './Users';
import { Specialties } from './Specialties';
import { DoctorSchedules } from './DoctorSchedules';
import { Ratings } from './Ratings';
export declare class DoctorProfiles {
    id: number;
    userId: number;
    specialtyId: number;
    fullName: string;
    avatarUrl: string;
    experienceYears: number | null;
    createdAt: Date;
    total_reviews: number;
    average_rating: number;
    appointments: Appointments[];
    user: Users;
    specialty: Specialties;
    doctorSchedules: DoctorSchedules[];
    ratings: Ratings[];
}
