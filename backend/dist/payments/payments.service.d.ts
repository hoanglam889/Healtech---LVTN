import { Repository } from 'typeorm';
import { ReturnQueryFromVNPay } from 'vnpay';
import { VnpayService } from 'nestjs-vnpay';
import { Invoices } from '../entities/Invoices';
import { Appointments } from '../entities/Appointments';
import { EventsGateway } from '../events/events.gateway';
import { MailService } from '../mail/mail.service';
import { AppointmentStatusLogs } from '../entities/AppointmentStatusLogs';
export declare class PaymentsService {
    private readonly vnpayService;
    private invoicesRepo;
    private appointmentsRepo;
    private appointmentStatusLogsRepo;
    private readonly eventsGateway;
    private readonly mailService;
    private readonly logger;
    constructor(vnpayService: VnpayService, invoicesRepo: Repository<Invoices>, appointmentsRepo: Repository<Appointments>, appointmentStatusLogsRepo: Repository<AppointmentStatusLogs>, eventsGateway: EventsGateway, mailService: MailService);
    createPaymentUrl(invoiceId: string, amount: number, source?: string): Promise<string>;
    vnpayReturn(query: ReturnQueryFromVNPay): Promise<{
        status: string;
        invoiceId: string;
        amount: string;
        message: string;
    }>;
}
