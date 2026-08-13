import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPaymentUrl(invoiceId: string, amount: number, source?: string): Promise<{
        url: string;
    }>;
    vnpayReturn(query: any, res: any): Promise<any>;
}
