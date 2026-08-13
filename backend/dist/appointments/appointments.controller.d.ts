import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<{
        success: boolean;
        appointment: import("../entities/Appointments").Appointments;
        invoice: import("../entities/Invoices").Invoices;
    }>;
    findAll(userId?: string): Promise<import("../entities/Appointments").Appointments[]>;
    findOne(id: string): Promise<import("../entities/Appointments").Appointments>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<import("../entities/Appointments").Appointments>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
