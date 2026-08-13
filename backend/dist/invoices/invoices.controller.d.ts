import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    getInvoiceDetails(appointmentId: string): Promise<{
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
