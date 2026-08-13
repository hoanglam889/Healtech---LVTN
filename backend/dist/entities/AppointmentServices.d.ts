import { Appointments } from './Appointments';
import { Services } from './Services';
export declare class AppointmentServices {
    id: number;
    appointmentId: number;
    serviceId: number;
    quantity: number | null;
    snapshotPrice: string;
    createdAt: Date;
    appointment: Appointments;
    service: Services;
}
