import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { MedicalRecords } from '../entities/MedicalRecords';
import { AppointmentStatusLogs } from '../entities/AppointmentStatusLogs';
import { Notifications } from '../entities/Notifications';
import { Patients } from '../entities/Patients';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepo: Repository<Appointments>,
    @InjectRepository(Invoices)
    private invoicesRepo: Repository<Invoices>,
    @InjectRepository(AppointmentStatusLogs)
    private statusLogsRepo: Repository<AppointmentStatusLogs>,
    @InjectRepository(Notifications)
    private notificationsRepo: Repository<Notifications>,
    @InjectRepository(Patients)
    private patientsRepo: Repository<Patients>,
    private dataSource: DataSource,
  ) {}

  private async sendNotification(patientId: number, title: string, content: string) {
    try {
      const patient = await this.patientsRepo.findOne({ where: { id: patientId } });
      if (patient?.patientAccountId) {
        const notif = this.notificationsRepo.create({ patientAccountId: patient.patientAccountId, title, content });
        await this.notificationsRepo.save(notif);
      }
    } catch {}
  }

  private computePriorityScore(patient: Patients | null, invoiceStatus: string | null | undefined, appointmentDate: string, appointmentTime: string | null): number {
    let baseScore = 5;

    if (patient?.dob) {
      const dobDate = new Date(patient.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
      if (age < 6 || age > 60) baseScore = 8;
    }

    const isPaidInAdvance = (invoiceStatus ?? '') === 'PAID';
    let lateModifier = 0;

    if (appointmentDate && appointmentTime) {
      try {
        const scheduledDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
        if (!isNaN(scheduledDateTime.getTime())) {
          const diffMinutes = (Date.now() - scheduledDateTime.getTime()) / 60000;
          if (diffMinutes > 20) lateModifier = -2;
        }
      } catch { /* ignore invalid date formats */ }
    }

    return baseScore + 1 + (isPaidInAdvance ? 1 : 0) + lateModifier;
  }

  async create(createDto: CreateAppointmentDto) {
    const { patientId, doctorProfileId, appointmentDate, appointmentTime, paymentMethod } = createDto;
    const bookingType = createDto.bookingType ?? 'ONLINE';
    const isWalkIn = bookingType === 'OFFLINE';

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let qrCode = '';
      let isUnique = false;
      while (!isUnique) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const randHex = Math.random().toString(16).substring(2, 10).toUpperCase();
        qrCode = `HT-APPT-${yyyy}${mm}${dd}-${randHex}`;
        const existing = await queryRunner.manager.findOne(Appointments, { where: { qrCode } });
        if (!existing) isUnique = true;
      }

      const initialStatus = isWalkIn ? 'WAITING' : 'BOOKED';

      const appointment = new Appointments();
      appointment.qrCode = qrCode;
      appointment.patientId = patientId;
      appointment.doctorProfileId = doctorProfileId;
      appointment.appointmentDate = appointmentDate;
      appointment.appointmentTime = appointmentTime;
      appointment.status = initialStatus;
      appointment.bookingType = bookingType;
      appointment.priorityScore = 1;

      const savedAppointment = await queryRunner.manager.save(Appointments, appointment);

      const invoice = new Invoices();
      invoice.appointmentId = savedAppointment.id;
      invoice.totalAmount = '150000.00';
      invoice.paymentMethod = paymentMethod;
      invoice.status = 'UNPAID';
      invoice.paidAt = null;

      if (paymentMethod === 'VNPAY') {
        invoice.status = 'PAID';
        invoice.paidAt = new Date();
      }

      await queryRunner.manager.save(Invoices, invoice);

      // For walk-ins that go straight to WAITING, compute priority score immediately
      if (isWalkIn) {
        const patient = await queryRunner.manager.findOne(Patients, { where: { id: patientId } });
        const score = this.computePriorityScore(patient, invoice.status, appointmentDate, appointmentTime);
        await queryRunner.manager.update(Appointments, savedAppointment.id, { priorityScore: score });
        savedAppointment.priorityScore = score;
      }

      // Log initial status
      const log = new AppointmentStatusLogs();
      log.appointmentId = savedAppointment.id;
      log.oldStatus = null;
      log.newStatus = initialStatus;
      log.changedBy = null;
      log.changedAt = new Date();
      await queryRunner.manager.save(AppointmentStatusLogs, log);

      await queryRunner.commitTransaction();

      // Send booking confirmation notification for online bookings only
      if (!isWalkIn) {
        this.sendNotification(
          patientId,
          'Đặt lịch thành công!',
          `Lịch khám ngày ${appointmentDate} đã được xác nhận. Mã QR: ${qrCode}`,
        );
      }

      return { success: true, appointment: savedAppointment, invoice };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Lỗi tạo lịch khám: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId?: number, page?: number, limit?: number) {
    const take = limit || 50;
    const skip = page ? (page - 1) * take : 0;

    const [data, total] = await this.appointmentsRepo.findAndCount({
      where: userId ? { patient: { patientAccountId: userId } } : {},
      relations: {
        patient: true,
        doctorProfile: { specialty: true },
        invoices: true,
        medicalRecords: true,
      },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });

    if (page) return { data, total, page, limit: take };
    return data;
  }

  async findOne(id: number) {
    const appointment = await this.appointmentsRepo.findOne({
      where: { id },
      relations: {
        patient: true,
        doctorProfile: { specialty: true },
        invoices: true,
        medicalRecords: true,
      },
    });
    if (!appointment) throw new NotFoundException(`Không tìm thấy lịch hẹn có ID #${id}`);
    return appointment;
  }

  async update(id: number, updateDto: any, changedByUserId?: number) {
    const appointment = await this.findOne(id);

    const { invoiceStatus, symptoms, diagnosis, notes, ...appointmentFields } = updateDto;

    // Smart priority score when checking in
    if (appointmentFields.status === 'WAITING') {
      appointmentFields.priorityScore = this.computePriorityScore(
        appointment.patient,
        appointment.invoices?.status,
        appointment.appointmentDate,
        appointment.appointmentTime,
      );
    }

    // Update appointment
    if (Object.keys(appointmentFields).length > 0) {
      await this.appointmentsRepo.update(id, appointmentFields);
    }

    // Write status log and send notification
    if (appointmentFields.status && appointmentFields.status !== appointment.status) {
      const log = new AppointmentStatusLogs();
      log.appointmentId = id;
      log.oldStatus = appointment.status as any;
      log.newStatus = appointmentFields.status;
      log.changedBy = changedByUserId || null;
      log.changedAt = new Date();
      await this.statusLogsRepo.save(log);

      if (appointment.patient?.patientAccountId) {
        const notifMap: Partial<Record<string, { title: string; content: string }>> = {
          WAITING: { title: 'Check-in thành công!', content: 'Bạn đã được xếp vào hàng đợi. Vui lòng chờ được gọi tên.' },
          EXAMINING: { title: 'Bắt đầu khám!', content: 'Bác sĩ đang tiến hành khám cho bạn.' },
          DONE: { title: 'Khám hoàn tất!', content: 'Buổi khám đã hoàn tất. Hãy xem sổ sức khỏe để biết kết quả.' },
          CANCELLED: { title: 'Lịch hẹn đã hủy', content: 'Lịch hẹn của bạn đã bị hủy.' },
        };
        const notif = notifMap[appointmentFields.status];
        if (notif) {
          this.sendNotification(appointment.patient.id, notif.title, notif.content);
        }
      }
    }

    // Update invoice
    if (invoiceStatus) {
      const invoice = await this.invoicesRepo.findOne({ where: { appointmentId: id } });
      if (invoice) {
        invoice.status = invoiceStatus;
        invoice.paidAt = invoiceStatus === 'PAID' ? new Date() : null;
        await this.invoicesRepo.save(invoice);
      }
    }

    // Create/update medical record
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
    const appointment = await this.findOne(id);
    await this.appointmentsRepo.remove(appointment);
    return { success: true, message: `Đã xóa lịch hẹn #${id} thành công` };
  }
}
