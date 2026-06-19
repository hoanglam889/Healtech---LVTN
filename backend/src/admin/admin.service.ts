import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { Patients } from '../entities/Patients';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { DoctorSchedules } from '../entities/DoctorSchedules';
import { Shifts } from '../entities/Shifts';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Appointments)
    private readonly appointmentsRepo: Repository<Appointments>,
    @InjectRepository(Invoices)
    private readonly invoicesRepo: Repository<Invoices>,
    @InjectRepository(Patients)
    private readonly patientsRepo: Repository<Patients>,
    @InjectRepository(DoctorProfiles)
    private readonly doctorProfilesRepo: Repository<DoctorProfiles>,
    @InjectRepository(DoctorSchedules)
    private readonly doctorSchedulesRepo: Repository<DoctorSchedules>,
    @InjectRepository(Shifts)
    private readonly shiftsRepo: Repository<Shifts>,
  ) {}

  // 1. Lấy dữ liệu thống kê tổng hợp (Overview Stats)
  async getDashboardStats() {
    // Tính tổng doanh thu (Các hóa đơn đã thanh toán)
    const paidInvoices = await this.invoicesRepo.find({
      where: { status: 'PAID' },
    });
    const totalRevenue = paidInvoices.reduce(
      (sum, item) => sum + parseFloat(item.totalAmount || '0'),
      0,
    );

    // Đếm số ca khám, hồ sơ bệnh nhân, bác sĩ
    const totalAppointments = await this.appointmentsRepo.count();
    const totalPatients = await this.patientsRepo.count();
    const totalDoctors = await this.doctorProfilesRepo.count();

    // Lấy 5 ca khám gần đây nhất
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
      let statusLabel = 'Chờ khám';
      if (act.status === 'DONE') statusLabel = 'Hoàn thành';
      if (act.status === 'CANCELLED') statusLabel = 'Đã hủy';

      return {
        id: act.qrCode || `HT-${act.id}`,
        patient: act.patient?.fullName || 'N/A',
        doctor: act.doctorProfile?.fullName ? `BS. ${act.doctorProfile.fullName}` : 'N/A',
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

  // 2. Lấy danh sách lịch trực của bác sĩ
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
      doctor: item.doctorProfile?.fullName ? `BS. ${item.doctorProfile.fullName}` : 'N/A',
      specialty: item.doctorProfile?.specialty?.name || 'Chuyên khoa',
      day: this.getWeekdayLabel(item.date),
      shift: item.shift ? `${item.shift.name} (${item.shift.startTime.substring(0, 5)} - ${item.shift.endTime.substring(0, 5)})` : 'Chưa xếp ca',
      clinicRoom: `Phòng ${item.doctorProfile?.id ? 100 + item.doctorProfile.id : 101}`, // Mock phòng khám theo ID bác sĩ
    }));
  }

  // 3. Phân ca trực mới cho bác sĩ
  async createSchedule(dto: { doctorProfileId: number; shiftId: number; date: string; maxPatients?: number }) {
    const schedule = new DoctorSchedules();
    schedule.doctorProfileId = dto.doctorProfileId;
    schedule.shiftId = dto.shiftId;
    schedule.date = dto.date;
    schedule.maxPatients = dto.maxPatients || 5;

    return this.doctorSchedulesRepo.save(schedule);
  }

  // 4. Xóa ca trực bác sĩ
  async deleteSchedule(id: number) {
    const schedule = await this.doctorSchedulesRepo.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Không tìm thấy ca trực với ID #${id}`);
    }
    await this.doctorSchedulesRepo.remove(schedule);
    return { success: true, message: `Đã xóa thành công ca trực #${id}` };
  }

  // 5. Lấy danh sách các ca trực mẫu (Shifts)
  async getShifts() {
    return this.shiftsRepo.find();
  }

  // Hàm helper định dạng ngày
  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  // Hàm helper đổi ngày sang Thứ trong tuần
  private getWeekdayLabel(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const day = date.getDay();
      const labels = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      return labels[day] || dateStr;
    } catch {
      return dateStr;
    }
  }
}
