import { Appointments } from './Appointments';
import { Users } from './Users';
export declare class AppointmentStatusLogs {
    id: number;
    appointmentId: number;
    oldStatus: 'PENDING' | 'BOOKED' | 'WAITING' | 'EXAMINING' | 'DOING_SERVICE' | 'DONE' | 'CANCELLED' | null;
    newStatus: 'PENDING' | 'BOOKED' | 'WAITING' | 'EXAMINING' | 'DOING_SERVICE' | 'DONE' | 'CANCELLED';
    changedBy: number | null;
    changedAt: Date;
    notes: string | null;
    appointment: Appointments;
    changedBy2: Users;
}
