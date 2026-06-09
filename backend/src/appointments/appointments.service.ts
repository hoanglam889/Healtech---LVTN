import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepo: Repository<Appointments>,
    @InjectRepository(Invoices)
    private invoicesRepo: Repository<Invoices>,
    private dataSource: DataSource
  ) {}

  async create(createDto: CreateAppointmentDto) {
    const { patientId, doctorProfileId, appointmentDate, appointmentTime, paymentMethod } = createDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Tạo mã QR code duy nhất dạng doanh nghiệp bảo mật: HT-APPT-YYYYMMDD-HEX8
      let qrCode = '';
      let isUnique = false;
      while (!isUnique) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}${mm}${dd}`;

        // Sinh 8 ký tự Hexadecimal ngẫu nhiên (chữ in hoa)
        const randHex = Math.random().toString(16).substring(2, 10).toUpperCase();
        
        qrCode = `HT-APPT-${dateStr}-${randHex}`; // Định dạng: HT-APPT-20260607-4E2F9B8A
        
        const existing = await queryRunner.manager.findOne(Appointments, { where: { qrCode } });
        if (!existing) {
          isUnique = true;
        }
      }

      // 2. Tạo đối tượng Lịch khám
      const appointment = new Appointments();
      appointment.qrCode = qrCode;
      appointment.patientId = patientId;
      appointment.doctorProfileId = doctorProfileId;
      appointment.appointmentDate = appointmentDate;
      appointment.appointmentTime = appointmentTime;
      appointment.status = 'BOOKED';
      appointment.priorityScore = 1;

      const savedAppointment = await queryRunner.manager.save(Appointments, appointment);

      // 3. Tạo Hóa đơn đi kèm
      const invoice = new Invoices();
      invoice.appointmentId = savedAppointment.id;
      invoice.totalAmount = '150000.00'; // Tiền khám mặc định
      invoice.paymentMethod = paymentMethod;
      
      if (paymentMethod === 'VNPAY') {
        invoice.status = 'PAID';
        invoice.paidAt = new Date();
      } else {
        invoice.status = 'UNPAID';
        invoice.paidAt = null;
      }

      await queryRunner.manager.save(Invoices, invoice);

      await queryRunner.commitTransaction();

      return {
        success: true,
        appointment: savedAppointment,
        invoice
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Lỗi tạo lịch khám: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId?: number) {
    return this.appointmentsRepo.find({
      where: userId ? { patient: { patientAccountId: userId } } : {},
      relations: {
        patient: true,
        doctorProfile: true,
        invoices: true
      }
    });
  }

  async findOne(id: number) {
    const appointment = await this.appointmentsRepo.findOne({
      where: { id },
      relations: {
        patient: true,
        doctorProfile: true,
        invoices: true
      }
    });
    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn có ID #${id}`);
    }
    return appointment;
  }

  async update(id: number, updateDto: UpdateAppointmentDto) {
    await this.findOne(id); // Kiểm tra xem bản ghi có tồn tại không
    await this.appointmentsRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const appointment = await this.findOne(id); // Kiểm tra xem bản ghi có tồn tại không
    await this.appointmentsRepo.remove(appointment);
    return { success: true, message: `Đã xóa lịch hẹn #${id} thành công` };
  }
}
