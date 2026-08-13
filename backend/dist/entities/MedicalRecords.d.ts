import { Appointments } from './Appointments';
export declare class MedicalRecords {
    id: number;
    appointmentId: number;
    symptoms: string;
    diagnosis: string | null;
    notes: string | null;
    createdAt: Date;
    appointment: Appointments;
}
