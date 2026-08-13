import { Repository } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { Patients } from '../entities/Patients';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { DoctorSchedules } from '../entities/DoctorSchedules';
import { Shifts } from '../entities/Shifts';
export declare class AdminService {
    private readonly appointmentsRepo;
    private readonly invoicesRepo;
    private readonly patientsRepo;
    private readonly doctorProfilesRepo;
    private readonly doctorSchedulesRepo;
    private readonly shiftsRepo;
    constructor(appointmentsRepo: Repository<Appointments>, invoicesRepo: Repository<Invoices>, patientsRepo: Repository<Patients>, doctorProfilesRepo: Repository<DoctorProfiles>, doctorSchedulesRepo: Repository<DoctorSchedules>, shiftsRepo: Repository<Shifts>);
    getDashboardStats(): Promise<{
        totalRevenue: string;
        totalAppointments: number;
        totalPatients: number;
        totalDoctors: number;
        recentActivities: {
            id: string;
            patient: string;
            doctor: string;
            time: string;
            type: string;
            status: string;
            amount: string;
        }[];
    }>;
    getSchedules(): Promise<{
        id: number;
        doctor: string;
        doctorProfileId: number;
        specialty: string;
        specialtyId: number | null;
        day: string;
        date: string;
        shift: string;
        shiftId: number;
        shiftName: string;
        shiftTime: string;
        clinicRoom: string;
    }[]>;
    createSchedule(dto: {
        doctorProfileId: number;
        shiftId: any;
        date: string;
        maxPatients?: number;
    }): Promise<{
        success: boolean;
    } | undefined>;
    deleteSchedule(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getShifts(): Promise<Shifts[]>;
    private formatDate;
    private getWeekdayLabel;
}
