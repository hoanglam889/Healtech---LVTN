import { AppointmentServicesService } from './appointment-services.service';
import { CreateAppointmentServiceDto } from './dto/create-appointment-service.dto';
import { UpdateAppointmentServiceDto } from './dto/update-appointment-service.dto';
export declare class AppointmentServicesController {
    private readonly appointmentServicesService;
    constructor(appointmentServicesService: AppointmentServicesService);
    create(createAppointmentServiceDto: CreateAppointmentServiceDto): Promise<import("../entities/AppointmentServices").AppointmentServices>;
    findAll(): string;
    findByAppointment(appointmentId: string): Promise<import("../entities/AppointmentServices").AppointmentServices[]>;
    update(id: string, updateAppointmentServiceDto: UpdateAppointmentServiceDto): Promise<import("../entities/AppointmentServices").AppointmentServices>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
