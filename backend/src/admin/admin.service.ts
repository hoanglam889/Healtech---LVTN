import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
      let statusLabel = 'Đã đặt';
      if (act.status === 'WAITING' || act.status === 'EXAMINING')
        statusLabel = 'Đã check-in';
      if (act.status === 'DONE') statusLabel = 'Hoàn thành';
      if (act.status === 'CANCELLED') statusLabel = 'Đã hủy';

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
      clinicRoom: `Phòng ${item.doctorProfile?.id ? 100 + item.doctorProfile.id : 101}`, // Mock phòng khám theo ID bác sĩ
    }));
  }

  // 3. Phân ca trực mới cho bác sĩ
  async createSchedule(dto: {
    doctorProfileId: number;
    shiftId: any;
    date: string;
    maxPatients?: number;
  }) {
    // Không xếp lịch cho ngày trong quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduleDate = new Date(dto.date);
    scheduleDate.setHours(0, 0, 0, 0);
    if (scheduleDate < today) {
      throw new BadRequestException(
        'Không thể xếp lịch cho những ngày đã qua!',
      );
    }

    const shiftVal = dto.shiftId;
    if (typeof shiftVal === 'string' || isNaN(+shiftVal)) {
      const sessionName = shiftVal; // "Sáng", "Chiều" hoặc "Tối"
      const allShifts = await this.shiftsRepo.find();
      const targetShifts = allShifts.filter((s) =>
        s.name?.includes(sessionName),
      );

      const savedSchedules: DoctorSchedules[] = [];
      for (const shift of targetShifts) {
        // Tránh tạo trùng lặp lịch trực nếu đã tồn tại
        const existing = await this.doctorSchedulesRepo.findOne({
          where: {
            doctorProfileId: dto.doctorProfileId,
            shiftId: shift.id,
            date: dto.date,
          },
        });
        if (!existing) {
          const schedule = new DoctorSchedules();
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
    } else {
      const schedule = new DoctorSchedules();
      schedule.doctorProfileId = dto.doctorProfileId;
      schedule.shiftId = +shiftVal;
      schedule.date = dto.date;
      schedule.maxPatients = dto.maxPatients || 5;

      return this.doctorSchedulesRepo.save(schedule);
    }
  }

  // 4. Xóa ca trực bác sĩ (xóa cả buổi trực để đồng bộ)
  async deleteSchedule(id: number) {
    const schedule = await this.doctorSchedulesRepo.findOne({
      where: { id },
      relations: { shift: true },
    });
    if (!schedule) {
      throw new NotFoundException(`Không tìm thấy ca trực với ID #${id}`);
    }

    let prefix = '';
    if (schedule.shift?.name) {
      if (schedule.shift.name.includes('Sáng')) prefix = 'Sáng';
      else if (schedule.shift.name.includes('Chiều')) prefix = 'Chiều';
      else if (schedule.shift.name.includes('Tối')) prefix = 'Tối';
    }

    if (prefix) {
      const schedulesToDelete = await this.doctorSchedulesRepo.find({
        where: {
          doctorProfileId: schedule.doctorProfileId,
          date: schedule.date,
        },
        relations: { shift: true },
      });

      const targets = schedulesToDelete.filter((item) =>
        item.shift?.name?.includes(prefix),
      );
      await this.doctorSchedulesRepo.remove(targets);
    } else {
      await this.doctorSchedulesRepo.remove(schedule);
    }

    return { success: true, message: `Đã xóa thành công ca trực` };
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
    } catch {
      return dateStr;
    }
  }
}
