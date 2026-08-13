import { AppointmentServices } from './AppointmentServices';
export declare class Services {
    id: number;
    name: string;
    description: string | null;
    price: string;
    isActive: boolean | null;
    createdAt: Date;
    appointmentServices: AppointmentServices[];
}
