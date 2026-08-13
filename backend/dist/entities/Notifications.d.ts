import { PatientAccounts } from './PatientAccounts';
export declare class Notifications {
    id: number;
    patientAccountId: number;
    title: string;
    content: string;
    isRead: boolean | null;
    createdAt: Date;
    patientAccount: PatientAccounts;
}
