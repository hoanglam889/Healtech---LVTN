import { Repository } from 'typeorm';
import { Invoices } from '../entities/Invoices';
import { AppointmentServices } from '../entities/AppointmentServices';
export declare class InvoicesService {
    private readonly invoicesRepo;
    private readonly apptServicesRepo;
    constructor(invoicesRepo: Repository<Invoices>, apptServicesRepo: Repository<AppointmentServices>);
    getInvoiceDetails(appointmentId: number): Promise<{
        id: number;
        appointmentId: number;
        status: "CANCELLED" | "UNPAID" | "PAID" | null;
        totalAmount: string;
        createdAt: Date;
        paidAt: Date | null;
        paymentMethod: "VNPAY" | "CASH" | null;
        breakdown: {
            examFee: {
                name: string;
                price: number;
            };
            services: {
                id: number;
                serviceId: number;
                name: string;
                snapshotPrice: number;
                quantity: number | null;
            }[];
        };
    }>;
}
