import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { MedicalRecords } from '../entities/MedicalRecords';

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
        doctorProfile: {
          specialty: true
        },
        invoices: true,
        medicalRecords: true
      }
    });
  }

  async findOne(id: number) {
    const appointment = await this.appointmentsRepo.findOne({
      where: { id },
      relations: {
        patient: true,
        doctorProfile: {
          specialty: true
        },
        invoices: true,
        medicalRecords: true
      }
    });
    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn có ID #${id}`);
    }
    return appointment;
  }

  async update(id: number, updateDto: any) {
    const appointment = await this.findOne(id);
    
    const { invoiceStatus, symptoms, diagnosis, notes, ...appointmentFields } = updateDto;
    
    // Nếu trạng thái đổi thành WAITING (Lễ tân check-in), tính điểm priority_score cho Smart Queue
    if (appointmentFields.status === 'WAITING') {
      let baseScore = 5; // Mặc định người trưởng thành là 5
      
      if (appointment.patient && appointment.patient.dob) {
        const dobDate = new Date(appointment.patient.dob);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        
        // Trẻ em < 6 tuổi hoặc Người già > 60 tuổi
        if (age < 6 || age > 60) {
          baseScore = 8;
        }
      }
      
      const isBookedViaApp = true; // Khách hàng đặt lịch trước
      const isPaidInAdvance = appointment.invoices && appointment.invoices.status === 'PAID';
      
      let lateModifier = 0;
      if (appointment.appointmentDate && appointment.appointmentTime) {
        try {
          const scheduledTimeStr = `${appointment.appointmentDate}T${appointment.appointmentTime}`;
          const scheduledDateTime = new Date(scheduledTimeStr);
          const today = new Date();
          
          if (!isNaN(scheduledDateTime.getTime())) {
            const diffInMs = today.getTime() - scheduledDateTime.getTime();
            const diffInMinutes = diffInMs / (1000 * 60);
            
            // Đến trễ quá 20 phút
            if (diffInMinutes > 20) {
              lateModifier = -2;
            }
          }
        } catch (timeErr) {
          console.error('Lỗi tính toán thời gian đi trễ:', timeErr);
        }
      }
      
      appointmentFields.priorityScore = baseScore + (isBookedViaApp ? 1 : 0) + (isPaidInAdvance ? 1 : 0) + lateModifier;
    }
    
    // Cập nhật lịch khám
    if (appointmentFields && Object.keys(appointmentFields).length > 0) {
      await this.appointmentsRepo.update(id, appointmentFields);
    }
    
    // Cập nhật hóa đơn
    if (invoiceStatus) {
      const invoice = await this.invoicesRepo.findOne({ where: { appointmentId: id } });
      if (invoice) {
        invoice.status = invoiceStatus;
        if (invoiceStatus === 'PAID') {
          invoice.paidAt = new Date();
        } else if (invoiceStatus === 'UNPAID') {
          invoice.paidAt = null;
        }
        await this.invoicesRepo.save(invoice);
      }
    }
    
    // Cập nhật bệnh án (Medical Record)
    if (symptoms !== undefined || diagnosis !== undefined || notes !== undefined) {
      const medicalRecordsRepo = this.dataSource.getRepository(MedicalRecords);
      let record = await medicalRecordsRepo.findOne({ where: { appointmentId: id } });
      
      if (!record) {
        record = new MedicalRecords();
        record.appointmentId = id;
      }
      
      if (symptoms !== undefined) record.symptoms = symptoms;
      if (diagnosis !== undefined) record.diagnosis = diagnosis;
      if (notes !== undefined) record.notes = notes;
      
      await medicalRecordsRepo.save(record);
    }
    
    return this.findOne(id);
  }


  async remove(id: number) {
    const appointment = await this.findOne(id); // Kiểm tra xem bản ghi có tồn tại không
    await this.appointmentsRepo.remove(appointment);
    return { success: true, message: `Đã xóa lịch hẹn #${id} thành công` };
  }
}
