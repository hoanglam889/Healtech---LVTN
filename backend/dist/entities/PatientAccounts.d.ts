import { Notifications } from './Notifications';
import { Patients } from './Patients';
import { Ratings } from './Ratings';
export declare class PatientAccounts {
    id: number;
    phone: string | null;
    email: string | null;
    passwordHash: string;
    isActive: boolean | null;
    otpCode: string | null;
    createdAt: Date;
    notifications: Notifications[];
    patients: Patients[];
    ratings: Ratings[];
}
