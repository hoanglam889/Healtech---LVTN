"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Appointments_1 = require("../entities/Appointments");
const Invoices_1 = require("../entities/Invoices");
const Patients_1 = require("../entities/Patients");
const DoctorProfiles_1 = require("../entities/DoctorProfiles");
const DoctorSchedules_1 = require("../entities/DoctorSchedules");
const Shifts_1 = require("../entities/Shifts");
let AdminService = class AdminService {
    appointmentsRepo;
    invoicesRepo;
    patientsRepo;
    doctorProfilesRepo;
    doctorSchedulesRepo;
    shiftsRepo;
    constructor(appointmentsRepo, invoicesRepo, patientsRepo, doctorProfilesRepo, doctorSchedulesRepo, shiftsRepo) {
        this.appointmentsRepo = appointmentsRepo;
        this.invoicesRepo = invoicesRepo;
        this.patientsRepo = patientsRepo;
        this.doctorProfilesRepo = doctorProfilesRepo;
        this.doctorSchedulesRepo = doctorSchedulesRepo;
        this.shiftsRepo = shiftsRepo;
    }
    async getDashboardStats() {
        const paidInvoices = await this.invoicesRepo.find({
            where: { status: 'PAID' },
        });
        const totalRevenue = paidInvoices.reduce((sum, item) => sum + parseFloat(item.totalAmount || '0'), 0);
        const totalAppointments = await this.appointmentsRepo.count();
        const totalPatients = await this.patientsRepo.count();
        const totalDoctors = await this.doctorProfilesRepo.count();
        const recentAppointments = await this.appointmentsRepo.find({
            relations: {
                patient: true,
                doctorProfile: {
                    specialty: true,
                },
                invoices: true,
            },
            order: {
                id: 'DESC',
            },
            take: 5,
        });
        const recentActivities = recentAppointments.map((act) => {
            let statusLabel = 'Đã đặt';
            if (act.status === 'WAITING' || act.status === 'EXAMINING')
                statusLabel = 'Đã check-in';
            if (act.status === 'DONE')
                statusLabel = 'Hoàn thành';
            if (act.status === 'CANCELLED')
                statusLabel = 'Đã hủy';
            return {
                id: act.qrCode || `HT-${act.id}`,
                patient: act.patient?.fullName || 'N/A',
                doctor: act.doctorProfile?.fullName
                    ? `BS. ${act.doctorProfile.fullName}`
                    : 'N/A',
                time: `${act.appointmentTime?.substring(0, 5) || ''} - ${this.formatDate(act.appointmentDate)}`,
                type: act.doctorProfile?.specialty?.name || 'Khám tổng quát',
                status: statusLabel,
                amount: act.invoices?.totalAmount
                    ? `${parseFloat(act.invoices.totalAmount).toLocaleString('vi-VN')} đ`
                    : '0 đ',
            };
        });
        return {
            totalRevenue: `${totalRevenue.toLocaleString('vi-VN')} đ`,
            totalAppointments,
            totalPatients,
            totalDoctors,
            recentActivities,
        };
    }
    async getSchedules() {
        const list = await this.doctorSchedulesRepo.find({
            relations: {
                doctorProfile: {
                    specialty: true,
                },
                shift: true,
            },
            order: {
                date: 'ASC',
            },
        });
        return list.map((item) => ({
            id: item.id,
            doctor: item.doctorProfile?.fullName
                ? `BS. ${item.doctorProfile.fullName}`
                : 'N/A',
            doctorProfileId: item.doctorProfileId,
            specialty: item.doctorProfile?.specialty?.name || 'Chuyên khoa',
            specialtyId: item.doctorProfile?.specialty?.id || null,
            day: this.getWeekdayLabel(item.date),
            date: item.date,
            shift: item.shift
                ? `${item.shift.name} (${item.shift.startTime.substring(0, 5)} - ${item.shift.endTime.substring(0, 5)})`
                : 'Chưa xếp ca',
            shiftId: item.shiftId,
            shiftName: item.shift?.name || '',
            shiftTime: item.shift
                ? `${item.shift.startTime.substring(0, 5)} - ${item.shift.endTime.substring(0, 5)}`
                : '',
            clinicRoom: `Phòng ${item.doctorProfile?.id ? 100 + item.doctorProfile.id : 101}`,
        }));
    }
    async createSchedule(dto) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduleDate = new Date(dto.date);
        scheduleDate.setHours(0, 0, 0, 0);
        if (scheduleDate < today) {
            throw new common_1.BadRequestException('Không thể xếp lịch cho những ngày đã qua!');
        }
        const shiftVal = dto.shiftId;
        if (typeof shiftVal === 'string' || isNaN(+shiftVal)) {
            const sessionName = shiftVal;
            const allShifts = await this.shiftsRepo.find();
            const targetShifts = allShifts.filter((s) => s.name?.includes(sessionName));
            const savedSchedules = [];
            for (const shift of targetShifts) {
                const existing = await this.doctorSchedulesRepo.findOne({
                    where: {
                        doctorProfileId: dto.doctorProfileId,
                        shiftId: shift.id,
                        date: dto.date,
                    },
                });
                if (!existing) {
                    const schedule = new DoctorSchedules_1.DoctorSchedules();
                    schedule.doctorProfileId = dto.doctorProfileId;
                    schedule.shiftId = shift.id;
                    schedule.date = dto.date;
                    schedule.maxPatients = dto.maxPatients || 5;
                    savedSchedules.push(schedule);
                }
            }
            if (savedSchedules.length > 0) {
                await this.doctorSchedulesRepo.save(savedSchedules);
            }
            return { success: true };
        }
    }
    async deleteSchedule(id) {
        const schedule = await this.doctorSchedulesRepo.findOne({
            where: { id },
            relations: { shift: true },
        });
        if (!schedule) {
            throw new common_1.NotFoundException(`Không tìm thấy ca trực với ID #${id}`);
        }
        let prefix = '';
        if (schedule.shift?.name) {
            if (schedule.shift.name.includes('Sáng'))
                prefix = 'Sáng';
            else if (schedule.shift.name.includes('Chiều'))
                prefix = 'Chiều';
            else if (schedule.shift.name.includes('Tối'))
                prefix = 'Tối';
        }
        if (prefix) {
            const schedulesToDelete = await this.doctorSchedulesRepo.find({
                where: {
                    doctorProfileId: schedule.doctorProfileId,
                    date: schedule.date,
                },
                relations: { shift: true },
            });
            const targets = schedulesToDelete.filter((item) => item.shift?.name?.includes(prefix));
            await this.doctorSchedulesRepo.remove(targets);
        }
        else {
            await this.doctorSchedulesRepo.remove(schedule);
        }
        return { success: true, message: `Đã xóa thành công ca trực` };
    }
    async getShifts() {
        return this.shiftsRepo.find();
    }
    formatDate(dateStr) {
        if (!dateStr)
            return '';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return dateStr;
        }
        catch {
            return dateStr;
        }
    }
    getWeekdayLabel(dateStr) {
        try {
            const date = new Date(dateStr);
            const day = date.getDay();
            const labels = [
                'Chủ Nhật',
                'Thứ Hai',
                'Thứ Ba',
                'Thứ Tư',
                'Thứ Năm',
                'Thứ Sáu',
                'Thứ Bảy',
            ];
            return labels[day] || dateStr;
        }
        catch {
            return dateStr;
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Appointments_1.Appointments)),
    __param(1, (0, typeorm_1.InjectRepository)(Invoices_1.Invoices)),
    __param(2, (0, typeorm_1.InjectRepository)(Patients_1.Patients)),
    __param(3, (0, typeorm_1.InjectRepository)(DoctorProfiles_1.DoctorProfiles)),
    __param(4, (0, typeorm_1.InjectRepository)(DoctorSchedules_1.DoctorSchedules)),
    __param(5, (0, typeorm_1.InjectRepository)(Shifts_1.Shifts)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map