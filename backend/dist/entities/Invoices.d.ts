import { Appointments } from './Appointments';
export declare class Invoices {
    id: number;
    appointmentId: number;
    totalAmount: string;
    status: 'UNPAID' | 'PAID' | 'CANCELLED' | null;
    paymentMethod: 'VNPAY' | 'CASH' | null;
    paidAt: Date | null;
    createdAt: Date;
    appointment: Appointments;
}
