import { Patients } from './Patients';
import { DoctorProfiles } from './DoctorProfiles';
import { AppointmentStatusLogs } from './AppointmentStatusLogs';
import { Invoices } from './Invoices';
import { MedicalRecords } from './MedicalRecords';
import { AppointmentServices } from './AppointmentServices';
import { Ratings } from './Ratings';
export declare class Appointments {
    id: number;
    qrCode: string;
    patientId: number;
    doctorProfileId: number | null;
    appointmentDate: string;
    appointmentTime: string | null;
    status: 'PENDING' | 'BOOKED' | 'WAITING' | 'EXAMINING' | 'DOING_SERVICE' | 'DONE' | 'CANCELLED' | null;
    priorityScore: number | null;
    createdAt: Date;
    patient: Patients;
    doctorProfile: DoctorProfiles;
    appointmentStatusLogs: AppointmentStatusLogs[];
    invoices: Invoices;
    medicalRecords: MedicalRecords;
    appointmentServices: AppointmentServices[];
    rating: Ratings;
}
