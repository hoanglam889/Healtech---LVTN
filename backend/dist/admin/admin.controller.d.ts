import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
        shiftId: number;
        date: string;
        maxPatients?: number;
    }): Promise<{
        success: boolean;
    } | undefined>;
    deleteSchedule(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getShifts(): Promise<import("../entities/Shifts").Shifts[]>;
}
