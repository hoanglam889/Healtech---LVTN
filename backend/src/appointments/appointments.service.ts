import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { MedicalRecords } from '../entities/MedicalRecords';
import { AppointmentStatusLogs } from '../entities/AppointmentStatusLogs';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { MailService } from '../mail/mail.service';
import { Patients } from '../entities/Patients';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepo: Repository<Appointments>,
    @InjectRepository(Invoices)
    private invoicesRepo: Repository<Invoices>,
    @InjectRepository(AppointmentStatusLogs)
    private appointmentStatusLogsRepo: Repository<AppointmentStatusLogs>,
    private dataSource: DataSource,
    private mailService: MailService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createDto: CreateAppointmentDto) {
    const {
      patientId,
      doctorProfileId,
      appointmentDate,
      appointmentTime,
      paymentMethod,
    } = createDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 0. Lấy thông tin bệnh nhân và kiểm tra
      const patientData = await queryRunner.manager
        .createQueryBuilder(Patients, 'p')
        .leftJoinAndSelect('p.patientAccount', 'pa')
        .where('p.id = :patientId', { patientId })
        .getOne();

      if (!patientData) {
        throw new BadRequestException('Hồ sơ bệnh nhân không tồn tại.');
      }

      // 1. Kiểm tra số lượng bệnh nhân tối đa (max_patients)
      // Tìm lịch làm việc của bác sĩ trong ngày và khung giờ đó
      const schedule = await queryRunner.manager
        .createQueryBuilder('doctor_schedules', 'ds')
        .innerJoinAndSelect('ds.shift', 's')
        .where('ds.doctorProfileId = :doctorId', { doctorId: doctorProfileId })
        .andWhere('ds.date = :date', { date: appointmentDate })
        .andWhere('s.startTime <= :time', { time: appointmentTime })
        .andWhere('s.endTime >= :time', { time: appointmentTime })
        .getOne();

      if (!schedule) {
        throw new BadRequestException(
          'Bác sĩ không có lịch làm việc vào khung giờ này. Vui lòng chọn lại.',
        );
      }

      // Đếm số ca khám đã đặt (không tính các ca đã hủy) trong ca làm việc này
      const currentBookedCount = await queryRunner.manager
        .createQueryBuilder('appointments', 'a')
        .where('a.doctorProfileId = :doctorId', { doctorId: doctorProfileId })
        .andWhere('a.appointmentDate = :date', { date: appointmentDate })
        .andWhere('a.appointmentTime >= :startTime', {
          startTime: schedule.shift.startTime,
        })
        .andWhere('a.appointmentTime <= :endTime', {
          endTime: schedule.shift.endTime,
        })
        .andWhere('a.status != :status', { status: 'CANCELLED' })
        .getCount();

      if (currentBookedCount >= schedule.maxPatients) {
        throw new BadRequestException(
          'Ca khám này đã đạt tối đa số lượng bệnh nhân cho phép. Vui lòng chọn ca khác.',
        );
      }
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
        const randHex = Math.random()
          .toString(16)
          .substring(2, 10)
          .toUpperCase();

        qrCode = `HT-APPT-${dateStr}-${randHex}`; // Định dạng: HT-APPT-20260607-4E2F9B8A

        const existing = await queryRunner.manager.findOne(Appointments, {
          where: { qrCode },
        });
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
      if (paymentMethod === 'VNPAY') {
        appointment.status = 'PENDING'; // Chờ thanh toán xong mới đổi thành BOOKED
      } else {
        appointment.status = 'BOOKED';
      }
      appointment.priorityScore = 1;

      const savedAppointment = await queryRunner.manager.save(
        Appointments,
        appointment,
      );

      // 3. Tạo Hóa đơn đi kèm
      const invoice = new Invoices();
      invoice.appointmentId = savedAppointment.id;
      invoice.totalAmount = '150000.00'; // Tiền khám mặc định
      invoice.paymentMethod = paymentMethod;

      if (paymentMethod === 'VNPAY') {
        invoice.status = 'UNPAID'; // Phải chờ webhook của VNPAY gọi về mới đổi sang PAID
        invoice.paidAt = null;
      } else {
        invoice.status = 'UNPAID';
        invoice.paidAt = null;
      }

      await queryRunner.manager.save(Invoices, invoice);

      // Ghi log trạng thái khởi tạo
      const initialLog = new AppointmentStatusLogs();
      initialLog.appointmentId = savedAppointment.id;
      initialLog.oldStatus = null;
      initialLog.newStatus = savedAppointment.status as any;
      initialLog.notes = paymentMethod === 'VNPAY' ? 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)' : 'Bệnh nhân tạo lịch hẹn (Tiền mặt)';
      await queryRunner.manager.save(AppointmentStatusLogs, initialLog);

      await queryRunner.commitTransaction();

      // Chỉ phát sóng và gửi mail nếu đã BOOKED (tiền mặt)
      if (appointment.status === 'BOOKED') {
        // PHÁT SÓNG 1: Báo có lịch khám mới
        this.eventsGateway.emitUpdate('appointment_created', { 
          appointmentId: savedAppointment.id 
        });

        // Sau khi lưu thành công, gửi email
        try {
        // Dùng lại thông tin patientData đã lấy ở trên cùng
        if (
          patientData &&
          patientData.patientAccount &&
          patientData.patientAccount.email
        ) {
          // Lấy tên chủ tài khoản (Bản thân)
          const accountOwner = await this.dataSource.manager
            .createQueryBuilder(Patients, 'p')
            .where('p.patientAccountId = :accountId', {
              accountId: patientData.patientAccountId,
            })
            .andWhere('p.relationship = :rel', { rel: 'Bản thân' })
            .getOne();

          const accountName = accountOwner
            ? accountOwner.fullName
            : 'Bệnh nhân';

          this.mailService
            .sendBookingSuccess(
              patientData.patientAccount.email,
              qrCode,
              appointmentDate,
              schedule.shift.startTime,
              accountName,
              patientData.fullName,
            )
            .catch((e) => console.error('Lỗi gửi mail:', e));
        }
      } catch (err) {
        console.error('Lỗi khi truy vấn gửi mail:', err);
      }
      } // Đóng if (appointment.status === 'BOOKED')

      return {
        success: true,
        appointment: savedAppointment,
        invoice,
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
        patient: {
          patientAccount: true,
        },
        doctorProfile: {
          specialty: true,
          user: true,
        },
        invoices: true,
        medicalRecords: true,
        rating: true,
        appointmentStatusLogs: {
          changedBy2: true, // Kèm thông tin người thay đổi
        },
      },
      order: {
        appointmentDate: 'DESC',
        appointmentTime: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const appointment = await this.appointmentsRepo.findOne({
      where: { id },
      relations: {
        patient: {
          patientAccount: true,
        },
        doctorProfile: {
          specialty: true,
          user: true,
        },
        invoices: true,
        medicalRecords: true,
        rating: true,
        appointmentStatusLogs: {
          changedBy2: true,
        },
      },
    });
    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn có ID #${id}`);
    }
    return appointment;
  }

  async update(id: number, updateDto: any) {
    const appointment = await this.findOne(id);
    
    console.log("UPDATE DTO RECEIVED:", updateDto);

    const {
      invoiceStatus,
      paymentMethod,
      symptoms,
      diagnosis,
      notes,
      ...appointmentFields
    } = updateDto;

    // Thiết lập State Machine (Cỗ máy trạng thái)
    if (appointmentFields.status && appointment.status) {
      const currentStatus = appointment.status as string;
      const newStatus = appointmentFields.status as string;

      const validTransitions: Record<string, string[]> = {
        BOOKED: ['WAITING', 'CANCELLED'],
        WAITING: ['EXAMINING', 'CANCELLED'],
        EXAMINING: ['DONE', 'CANCELLED', 'WAITING'],
        DONE: [], // Không được phép thay đổi
        CANCELLED: [], // Không được phép thay đổi
      };

      if (
        validTransitions[currentStatus] &&
        !validTransitions[currentStatus].includes(newStatus)
      ) {
        throw new BadRequestException(
          `Lỗi luồng xử lý: Không thể chuyển trạng thái từ ${currentStatus} sang ${newStatus}.`,
        );
      }
    }

    // Nếu trạng thái đổi thành WAITING (Lễ tân check-in), tính điểm priority_score cho Smart Queue
    if (appointmentFields.status === 'WAITING') {
      let isCompleted = appointment.patient?.isCompleted;

      // Fallback tính toán lại cho các hồ sơ cũ chưa được hệ thống tự động cập nhật
      if (!isCompleted && appointment.patient) {
        const p = appointment.patient;
        const birthYear = new Date(p.dob).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;

        isCompleted = !!(
          p.fullName &&
          p.dob &&
          (p.cccd || age < 16) &&
          p.address &&
          p.gender &&
          p.phone
        );
      }

      if (!isCompleted) {
        throw new BadRequestException(
          'Vui lòng cập nhật đầy đủ thông tin bệnh nhân (SĐT, Địa chỉ, CCCD nếu >= 16 tuổi) trước khi check-in.',
        );
      }

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
      const isPaidInAdvance =
        appointment.invoices && appointment.invoices.status === 'PAID';

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

      if (updateDto.priorityScore !== undefined) {
        appointmentFields.priorityScore = updateDto.priorityScore;
      } else {
        appointmentFields.priorityScore =
          baseScore +
          (isBookedViaApp ? 1 : 0) +
          (isPaidInAdvance ? 1 : 0) +
          lateModifier;
      }
    }

    // Cập nhật lịch khám
    if (appointmentFields && Object.keys(appointmentFields).length > 0) {
      // Kiểm tra xem có đổi ngày/giờ/bác sĩ không
      const isShiftChanged = 
        (appointmentFields.appointmentDate && appointmentFields.appointmentDate !== appointment.appointmentDate) ||
        (appointmentFields.appointmentTime && appointmentFields.appointmentTime !== appointment.appointmentTime) ||
        (appointmentFields.doctorProfileId && appointmentFields.doctorProfileId !== appointment.doctorProfileId);
        
      await this.appointmentsRepo.update(id, appointmentFields);
      
      // Nếu có dời lịch, ghi log
      if (isShiftChanged) {
        let noteStr = `Lễ tân dời lịch khám: `;
        if (appointmentFields.appointmentDate && appointmentFields.appointmentDate !== appointment.appointmentDate) {
          noteStr += `Ngày (${appointment.appointmentDate} -> ${appointmentFields.appointmentDate}). `;
        }
        if (appointmentFields.appointmentTime && appointmentFields.appointmentTime !== appointment.appointmentTime) {
          noteStr += `Giờ (${appointment.appointmentTime} -> ${appointmentFields.appointmentTime}). `;
        }
        if (appointmentFields.doctorProfileId && appointmentFields.doctorProfileId !== appointment.doctorProfileId) {
          noteStr += `Bác sĩ ID (${appointment.doctorProfileId} -> ${appointmentFields.doctorProfileId}). `;
        }
        
        await this.logStatusChange(id, appointment.status, appointment.status as string, null, noteStr);
      }

      // Nếu có đổi trạng thái, ghi log
      if (appointmentFields.status && appointmentFields.status !== appointment.status) {
        let noteStr = 'Cập nhật trạng thái khám';
        if (appointmentFields.status === 'WAITING') noteStr = 'Bệnh nhân đã check-in (Lễ tân xác nhận)';
        else if (appointmentFields.status === 'EXAMINING') noteStr = 'Bác sĩ gọi vào phòng khám';
        else if (appointmentFields.status === 'DONE') noteStr = 'Hoàn tất khám bệnh';
        else if (appointmentFields.status === 'CANCELLED') noteStr = 'Hủy lịch khám';
        
        await this.logStatusChange(id, appointment.status, appointmentFields.status, null, noteStr);
      }

      // ===== THUẬT TOÁN HÀNG ĐỢI (SMART QUEUE) =====
      // Khi bác sĩ gọi bệnh nhân này vào khám (EXAMINING), hàng đợi sẽ nhích lên 1 bậc.
      // Tìm người đứng đầu hàng đợi
      if (appointmentFields.status === 'EXAMINING') {
        try {
          const nextPatientInQueue = await this.appointmentsRepo.findOne({
            where: {
              doctorProfileId: appointment.doctorProfileId as number,
              appointmentDate: appointment.appointmentDate,
              status: 'WAITING', // Chỉ lấy những người đang chờ tại phòng khám
            },
            order: {
              priorityScore: 'DESC', // Ưu tiên điểm cao nhất
              appointmentTime: 'ASC', // Nếu bằng điểm thì ai tới trước (theo lịch) vào trước
            },
            relations: {
              patient: {
                patientAccount: true,
              },
            },
          });

          // Nếu tìm thấy người đang xếp thứ 1 và có email
          if (
            nextPatientInQueue &&
            nextPatientInQueue.patient?.patientAccount?.email
          ) {
            this.mailService
              .sendTurnReminder(nextPatientInQueue.patient.patientAccount.email)
              .catch((e) => console.error('Lỗi gửi mail nhắc lượt:', e));
          }
        } catch (queueErr) {
          console.error('Lỗi xử lý hàng đợi gửi mail:', queueErr);
        }
      }
    }

    // Cập nhật hóa đơn
    if (
      invoiceStatus ||
      paymentMethod ||
      appointmentFields.status === 'CANCELLED'
    ) {
      const invoice = await this.invoicesRepo.findOne({
        where: { appointmentId: id },
      });
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
        
        // PHÁT SÓNG: Hóa đơn được thanh toán
        if (invoiceStatus === 'PAID') {
          this.eventsGateway.emitUpdate('invoice_paid', { invoiceId: invoice.id });
        }
      }
    }

    // PHÁT SÓNG: Sinh ra hóa đơn chờ thu ngân khi bác sĩ khám xong (DONE)
    if (appointmentFields.status === 'DONE') {
      this.eventsGateway.emitUpdate('invoice_created', { appointmentId: id });
    }

    // Cập nhật bệnh án (Medical Record)
    if (
      symptoms !== undefined ||
      diagnosis !== undefined ||
      notes !== undefined
    ) {
      const medicalRecordsRepo = this.dataSource.getRepository(MedicalRecords);
      let record = await medicalRecordsRepo.findOne({
        where: { appointmentId: id },
      });

      if (!record) {
        record = new MedicalRecords();
        record.appointmentId = id;
      }

      if (symptoms !== undefined) record.symptoms = symptoms;
      if (diagnosis !== undefined) record.diagnosis = diagnosis;
      if (notes !== undefined) record.notes = notes;

      await medicalRecordsRepo.save(record);
    }
    this.eventsGateway.emitUpdate('appointment_updated', { 
      appointmentId: id 
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const appointment = await this.findOne(id); // Kiểm tra xem bản ghi có tồn tại không
    await this.appointmentsRepo.remove(appointment);
    return { success: true, message: `Đã xóa lịch hẹn #${id} thành công` };
  }

  // 10. Hàm Helper ghi log thay đổi trạng thái
  async logStatusChange(
    appointmentId: number,
    oldStatus: string | null,
    newStatus: string,
    changedBy: number | null = null,
    notes: string | null = null,
  ) {
    if (oldStatus === newStatus && !notes) return;
    await this.appointmentStatusLogsRepo.save({
      appointmentId,
      oldStatus: oldStatus as any,
      newStatus: newStatus as any,
      changedBy,
      notes,
    });
  }
}
