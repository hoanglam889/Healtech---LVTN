import { Injectable, BadRequestException, NotFoundException, HttpException } from '@nestjs/common';
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
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateAppointmentDto) {
    const { patientId, doctorProfileId, appointmentDate, appointmentTime, paymentMethod } = createDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const schedule = await queryRunner.manager
        .createQueryBuilder('doctor_schedules', 'ds')
        .innerJoinAndSelect('ds.shift', 's')
        .where('ds.doctorProfileId = :doctorId', { doctorId: doctorProfileId })
        .andWhere('ds.date = :date', { date: appointmentDate })
        .andWhere('s.startTime <= :time', { time: appointmentTime })
        .andWhere('s.endTime >= :time', { time: appointmentTime })
        .getOne();

      if (!schedule) {
        throw new BadRequestException({ i18nKey: 'errors.appointment.no_schedule' });
      }

      const currentBookedCount = await queryRunner.manager
        .createQueryBuilder('appointments', 'a')
        .where('a.doctorProfileId = :doctorId', { doctorId: doctorProfileId })
        .andWhere('a.appointmentDate = :date', { date: appointmentDate })
        .andWhere('a.appointmentTime >= :startTime', { startTime: schedule.shift.startTime })
        .andWhere('a.appointmentTime <= :endTime', { endTime: schedule.shift.endTime })
        .andWhere('a.status != :status', { status: 'CANCELLED' })
        .getCount();

      if (currentBookedCount >= schedule.maxPatients) {
        throw new BadRequestException({ i18nKey: 'errors.appointment.max_patients' });
      }

      let qrCode = '';
      let isUnique = false;
      while (!isUnique) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}${mm}${dd}`;
        const randHex = Math.random().toString(16).substring(2, 10).toUpperCase();
        qrCode = `HT-APPT-${dateStr}-${randHex}`;
        const existing = await queryRunner.manager.findOne(Appointments, { where: { qrCode } });
        if (!existing) isUnique = true;
      }

      const appointment = new Appointments();
      appointment.qrCode = qrCode;
      appointment.patientId = patientId;
      appointment.doctorProfileId = doctorProfileId;
      appointment.appointmentDate = appointmentDate;
      appointment.appointmentTime = appointmentTime;
      appointment.status = 'BOOKED';
      appointment.priorityScore = 1;

      const savedAppointment = await queryRunner.manager.save(Appointments, appointment);

      const invoice = new Invoices();
      invoice.appointmentId = savedAppointment.id;
      invoice.totalAmount = '150000.00';
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

      return { success: true, appointment: savedAppointment, invoice };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) throw err;
      throw new BadRequestException({
        i18nKey: 'errors.appointment.create_failed',
        args: { details: err.message },
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId?: number) {
    return this.appointmentsRepo.find({
      where: userId ? { patient: { patientAccountId: userId } } : {},
      relations: {
        patient: true,
        doctorProfile: { specialty: true },
        invoices: true,
        medicalRecords: true,
      },
    });
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
    if (!appointment) {
      throw new NotFoundException({ i18nKey: 'errors.appointment.not_found', args: { id } });
    }
    return appointment;
  }

  async update(id: number, updateDto: any) {
    const appointment = await this.findOne(id);

    const { invoiceStatus, paymentMethod, symptoms, diagnosis, notes, ...appointmentFields } = updateDto;

    if (appointmentFields.status && appointment.status) {
      const currentStatus = appointment.status as string;
      const newStatus = appointmentFields.status as string;

      const validTransitions: Record<string, string[]> = {
        BOOKED: ['WAITING', 'CANCELLED'],
        WAITING: ['EXAMINING', 'CANCELLED'],
        EXAMINING: ['DONE', 'CANCELLED'],
        DONE: [],
        CANCELLED: [],
      };

      if (validTransitions[currentStatus] && !validTransitions[currentStatus].includes(newStatus)) {
        throw new BadRequestException({
          i18nKey: 'errors.appointment.invalid_transition',
          args: { from: currentStatus, to: newStatus },
        });
      }
    }

    if (appointmentFields.status === 'WAITING') {
      if (!appointment.patient?.isCompleted) {
        throw new BadRequestException({ i18nKey: 'errors.appointment.patient_incomplete' });
      }

      let baseScore = 5;

      if (appointment.patient && appointment.patient.dob) {
        const dobDate = new Date(appointment.patient.dob);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
        }
        if (age < 6 || age > 60) {
          baseScore = 8;
        }
      }

      const isBookedViaApp = true;
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
            if (diffInMinutes > 20) {
              lateModifier = -2;
            }
          }
        } catch (timeErr) {
          console.error('Error calculating late modifier:', timeErr);
        }
      }

      appointmentFields.priorityScore =
        baseScore + (isBookedViaApp ? 1 : 0) + (isPaidInAdvance ? 1 : 0) + lateModifier;
    }

    if (appointmentFields && Object.keys(appointmentFields).length > 0) {
      await this.appointmentsRepo.update(id, appointmentFields);
    }

    if (invoiceStatus || paymentMethod || appointmentFields.status === 'CANCELLED') {
      const invoice = await this.invoicesRepo.findOne({ where: { appointmentId: id } });
      if (invoice) {
        if (appointmentFields.status === 'CANCELLED') {
          invoice.status = 'CANCELLED';
        } else if (invoiceStatus) {
          invoice.status = invoiceStatus;
          if (invoiceStatus === 'PAID') {
            invoice.paidAt = new Date();
          } else if (invoiceStatus === 'UNPAID') {
            invoice.paidAt = null;
          }
        }
        if (paymentMethod) {
          invoice.paymentMethod = paymentMethod;
        }
        await this.invoicesRepo.save(invoice);
      }
    }

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
