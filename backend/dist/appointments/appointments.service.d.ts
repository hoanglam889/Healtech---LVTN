import { Repository, DataSource } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { AppointmentStatusLogs } from '../entities/AppointmentStatusLogs';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { MailService } from '../mail/mail.service';
import { EventsGateway } from '../events/events.gateway';
export declare class AppointmentsService {
    private appointmentsRepo;
    private invoicesRepo;
    private appointmentStatusLogsRepo;
    private dataSource;
    private mailService;
    private eventsGateway;
    constructor(appointmentsRepo: Repository<Appointments>, invoicesRepo: Repository<Invoices>, appointmentStatusLogsRepo: Repository<AppointmentStatusLogs>, dataSource: DataSource, mailService: MailService, eventsGateway: EventsGateway);
    create(createDto: CreateAppointmentDto): Promise<{
        success: boolean;
        appointment: Appointments;
        invoice: Invoices;
    }>;
    findAll(userId?: number): Promise<Appointments[]>;
    findOne(id: number): Promise<Appointments>;
    update(id: number, updateDto: any): Promise<Appointments>;
    private calculatePriorityScore;
    remove(id: number, user?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    logStatusChange(appointmentId: number, oldStatus: string | null, newStatus: string, changedBy?: number | null, notes?: string | null): Promise<void>;
    cleanupPendingAppointments(): Promise<void>;
}
