import { CreateAppointmentServiceDto } from './dto/create-appointment-service.dto';
import { UpdateAppointmentServiceDto } from './dto/update-appointment-service.dto';
import { AppointmentServices } from '../entities/AppointmentServices';
import { DataSource, Repository } from 'typeorm';
import { EventsGateway } from '../events/events.gateway';
export declare class AppointmentServicesService {
    private readonly apptServicesRepo;
    private dataSource;
    private eventsGateway;
    constructor(apptServicesRepo: Repository<AppointmentServices>, dataSource: DataSource, eventsGateway: EventsGateway);
    recalculateInvoiceTotal(appointmentId: number, queryRunner?: any): Promise<void>;
    create(dto: CreateAppointmentServiceDto): Promise<AppointmentServices>;
    findAll(): string;
    findByAppointment(appointmentId: number): Promise<AppointmentServices[]>;
    update(id: number, dto: UpdateAppointmentServiceDto): Promise<AppointmentServices>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
