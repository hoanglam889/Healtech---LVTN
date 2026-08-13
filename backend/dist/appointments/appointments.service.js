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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Appointments_1 = require("../entities/Appointments");
const Invoices_1 = require("../entities/Invoices");
const MedicalRecords_1 = require("../entities/MedicalRecords");
const AppointmentStatusLogs_1 = require("../entities/AppointmentStatusLogs");
const mail_service_1 = require("../mail/mail.service");
const Patients_1 = require("../entities/Patients");
const events_gateway_1 = require("../events/events.gateway");
const schedule_1 = require("@nestjs/schedule");
let AppointmentsService = class AppointmentsService {
    appointmentsRepo;
    invoicesRepo;
    appointmentStatusLogsRepo;
    dataSource;
    mailService;
    eventsGateway;
    constructor(appointmentsRepo, invoicesRepo, appointmentStatusLogsRepo, dataSource, mailService, eventsGateway) {
        this.appointmentsRepo = appointmentsRepo;
        this.invoicesRepo = invoicesRepo;
        this.appointmentStatusLogsRepo = appointmentStatusLogsRepo;
        this.dataSource = dataSource;
        this.mailService = mailService;
        this.eventsGateway = eventsGateway;
    }
    async create(createDto) {
        const { patientId, doctorProfileId, appointmentDate, appointmentTime, paymentMethod, } = createDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const patientData = await queryRunner.manager
                .createQueryBuilder(Patients_1.Patients, 'p')
                .leftJoinAndSelect('p.patientAccount', 'pa')
                .where('p.id = :patientId', { patientId })
                .getOne();
            if (!patientData) {
                throw new common_1.BadRequestException('Hồ sơ bệnh nhân không tồn tại.');
            }
            const schedule = await queryRunner.manager
                .createQueryBuilder('doctor_schedules', 'ds')
                .innerJoinAndSelect('ds.shift', 's')
                .where('ds.doctorProfileId = :doctorId', { doctorId: doctorProfileId })
                .andWhere('ds.date = :date', { date: appointmentDate })
                .andWhere('s.startTime <= :time', { time: appointmentTime })
                .andWhere('s.endTime >= :time', { time: appointmentTime })
                .setLock('pessimistic_write')
                .getOne();
            if (!schedule) {
                throw new common_1.BadRequestException('Bác sĩ không có lịch làm việc vào khung giờ này. Vui lòng chọn lại.');
            }
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
                throw new common_1.BadRequestException('Ca khám này đã đạt tối đa số lượng bệnh nhân cho phép. Vui lòng chọn ca khác.');
            }
            let qrCode = '';
            let isUnique = false;
            while (!isUnique) {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}${mm}${dd}`;
                const randHex = Math.random()
                    .toString(16)
                    .substring(2, 10)
                    .toUpperCase();
                qrCode = `HT-APPT-${dateStr}-${randHex}`;
                const existing = await queryRunner.manager.findOne(Appointments_1.Appointments, {
                    where: { qrCode },
                });
                if (!existing) {
                    isUnique = true;
                }
            }
            const appointment = new Appointments_1.Appointments();
            appointment.qrCode = qrCode;
            appointment.patientId = patientId;
            appointment.doctorProfileId = doctorProfileId;
            appointment.appointmentDate = appointmentDate;
            appointment.appointmentTime = appointmentTime;
            if (paymentMethod === 'VNPAY') {
                appointment.status = 'PENDING';
            }
            else {
                appointment.status = 'BOOKED';
            }
            appointment.priorityScore = 1;
            const savedAppointment = await queryRunner.manager.save(Appointments_1.Appointments, appointment);
            const invoice = new Invoices_1.Invoices();
            invoice.appointmentId = savedAppointment.id;
            invoice.totalAmount = '150000.00';
            invoice.paymentMethod = paymentMethod;
            if (paymentMethod === 'VNPAY') {
                invoice.status = 'UNPAID';
                invoice.paidAt = null;
            }
            else {
                invoice.status = 'UNPAID';
                invoice.paidAt = null;
            }
            await queryRunner.manager.save(Invoices_1.Invoices, invoice);
            const initialLog = new AppointmentStatusLogs_1.AppointmentStatusLogs();
            initialLog.appointmentId = savedAppointment.id;
            initialLog.oldStatus = null;
            initialLog.newStatus = savedAppointment.status;
            initialLog.notes = paymentMethod === 'VNPAY' ? 'Bệnh nhân tạo lịch hẹn (Đợi thanh toán)' : 'Bệnh nhân tạo lịch hẹn (Tiền mặt)';
            await queryRunner.manager.save(AppointmentStatusLogs_1.AppointmentStatusLogs, initialLog);
            await queryRunner.commitTransaction();
            if (appointment.status === 'BOOKED') {
                this.eventsGateway.emitUpdate('appointment_created', {
                    appointmentId: savedAppointment.id
                });
                try {
                    if (patientData &&
                        patientData.patientAccount &&
                        patientData.patientAccount.email) {
                        const accountOwner = await this.dataSource.manager
                            .createQueryBuilder(Patients_1.Patients, 'p')
                            .where('p.patientAccountId = :accountId', {
                            accountId: patientData.patientAccountId,
                        })
                            .andWhere('p.relationship = :rel', { rel: 'Bản thân' })
                            .getOne();
                        const accountName = accountOwner
                            ? accountOwner.fullName
                            : 'Bệnh nhân';
                        this.mailService
                            .sendBookingSuccess(patientData.patientAccount.email, qrCode, appointmentDate, schedule.shift.startTime, accountName, patientData.fullName)
                            .catch((e) => console.error('Lỗi gửi mail:', e));
                    }
                }
                catch (err) {
                    console.error('Lỗi khi truy vấn gửi mail:', err);
                }
            }
            return {
                success: true,
                appointment: savedAppointment,
                invoice,
            };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException('Lỗi tạo lịch khám: ' + err.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(userId) {
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
                    changedBy2: true,
                },
            },
            order: {
                appointmentDate: 'DESC',
                appointmentTime: 'DESC',
            },
        });
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Không tìm thấy lịch hẹn có ID #${id}`);
        }
        return appointment;
    }
    async update(id, updateDto) {
        const appointment = await this.findOne(id);
        console.log("UPDATE DTO RECEIVED:", updateDto);
        const { invoiceStatus, paymentMethod, symptoms, diagnosis, notes, ...appointmentFields } = updateDto;
        if (appointmentFields.status && appointment.status) {
            const currentStatus = appointment.status;
            const newStatus = appointmentFields.status;
            const validTransitions = {
                PENDING: ['BOOKED', 'CANCELLED'],
                BOOKED: ['WAITING', 'CANCELLED'],
                WAITING: ['EXAMINING', 'CANCELLED'],
                EXAMINING: ['DONE', 'CANCELLED', 'WAITING', 'DOING_SERVICE'],
                DOING_SERVICE: ['WAITING', 'CANCELLED'],
                DONE: [],
                CANCELLED: [],
            };
            if (validTransitions[currentStatus] &&
                !validTransitions[currentStatus].includes(newStatus)) {
                throw new common_1.BadRequestException(`Lỗi luồng xử lý: Không thể chuyển trạng thái từ ${currentStatus} sang ${newStatus}.`);
            }
        }
        if (appointmentFields.status === 'WAITING') {
            appointmentFields.priorityScore = this.calculatePriorityScore(appointment, updateDto);
            if (appointment.status === 'DOING_SERVICE') {
                appointmentFields.priorityScore += 1000;
            }
        }
        if (appointmentFields && Object.keys(appointmentFields).length > 0) {
            const isShiftChanged = (appointmentFields.appointmentDate && appointmentFields.appointmentDate !== appointment.appointmentDate) ||
                (appointmentFields.appointmentTime && appointmentFields.appointmentTime !== appointment.appointmentTime) ||
                (appointmentFields.doctorProfileId && appointmentFields.doctorProfileId !== appointment.doctorProfileId);
            await this.appointmentsRepo.update(id, appointmentFields);
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
                await this.logStatusChange(id, appointment.status, appointment.status, null, noteStr);
            }
            if (appointmentFields.status && appointmentFields.status !== appointment.status) {
                let noteStr = 'Cập nhật trạng thái khám';
                if (appointmentFields.status === 'WAITING') {
                    noteStr = appointment.status === 'DOING_SERVICE' ? 'Đã nộp kết quả cận lâm sàng (Ưu tiên khám)' : 'Bệnh nhân đã check-in (Lễ tân xác nhận)';
                }
                else if (appointmentFields.status === 'EXAMINING')
                    noteStr = 'Bác sĩ gọi vào phòng khám';
                else if (appointmentFields.status === 'DOING_SERVICE')
                    noteStr = 'Bác sĩ chỉ định làm cận lâm sàng';
                else if (appointmentFields.status === 'DONE')
                    noteStr = 'Hoàn tất khám bệnh';
                else if (appointmentFields.status === 'CANCELLED')
                    noteStr = 'Hủy lịch khám';
                await this.logStatusChange(id, appointment.status, appointmentFields.status, null, noteStr);
            }
            if (appointmentFields.status === 'EXAMINING') {
                try {
                    const nextPatientInQueue = await this.appointmentsRepo.findOne({
                        where: {
                            doctorProfileId: appointment.doctorProfileId,
                            appointmentDate: appointment.appointmentDate,
                            status: 'WAITING',
                        },
                        order: {
                            priorityScore: 'DESC',
                            appointmentTime: 'ASC',
                        },
                        relations: {
                            patient: {
                                patientAccount: true,
                            },
                        },
                    });
                    if (nextPatientInQueue &&
                        nextPatientInQueue.patient?.patientAccount?.email) {
                        this.mailService
                            .sendTurnReminder(nextPatientInQueue.patient.patientAccount.email)
                            .catch((e) => console.error('Lỗi gửi mail nhắc lượt:', e));
                    }
                }
                catch (queueErr) {
                    console.error('Lỗi xử lý hàng đợi gửi mail:', queueErr);
                }
            }
        }
        if (invoiceStatus ||
            paymentMethod ||
            appointmentFields.status === 'CANCELLED') {
            const invoice = await this.invoicesRepo.findOne({
                where: { appointmentId: id },
            });
            if (invoice) {
                if (appointmentFields.status === 'CANCELLED') {
                    invoice.status = 'CANCELLED';
                }
                else if (invoiceStatus) {
                    invoice.status = invoiceStatus;
                    if (invoiceStatus === 'PAID') {
                        invoice.paidAt = new Date();
                    }
                    else if (invoiceStatus === 'UNPAID') {
                        invoice.paidAt = null;
                    }
                }
                if (paymentMethod) {
                    invoice.paymentMethod = paymentMethod;
                }
                await this.invoicesRepo.save(invoice);
                if (invoiceStatus === 'PAID') {
                    this.eventsGateway.emitUpdate('invoice_paid', { invoiceId: invoice.id });
                }
            }
        }
        if (appointmentFields.status === 'DONE') {
            this.eventsGateway.emitUpdate('invoice_created', { appointmentId: id });
        }
        if (symptoms !== undefined ||
            diagnosis !== undefined ||
            notes !== undefined) {
            const medicalRecordsRepo = this.dataSource.getRepository(MedicalRecords_1.MedicalRecords);
            let record = await medicalRecordsRepo.findOne({
                where: { appointmentId: id },
            });
            if (!record) {
                record = new MedicalRecords_1.MedicalRecords();
                record.appointmentId = id;
            }
            if (symptoms !== undefined)
                record.symptoms = symptoms;
            if (diagnosis !== undefined)
                record.diagnosis = diagnosis;
            if (notes !== undefined)
                record.notes = notes;
            await medicalRecordsRepo.save(record);
        }
        this.eventsGateway.emitUpdate('appointment_updated', {
            appointmentId: id
        });
        return this.findOne(id);
    }
    calculatePriorityScore(appointment, updateDto) {
        if (updateDto.priorityScore !== undefined) {
            return updateDto.priorityScore;
        }
        let isCompleted = appointment.patient?.isCompleted;
        if (!isCompleted && appointment.patient) {
            const p = appointment.patient;
            const birthYear = new Date(p.dob).getFullYear();
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            isCompleted = !!(p.fullName &&
                p.dob &&
                (p.cccd || age < 16) &&
                p.address &&
                p.gender &&
                p.phone);
        }
        if (!isCompleted) {
            throw new common_1.BadRequestException('Vui lòng cập nhật đầy đủ thông tin bệnh nhân (SĐT, Địa chỉ, CCCD nếu >= 16 tuổi) trước khi check-in.');
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
            }
            catch (timeErr) {
                console.error('Lỗi tính toán thời gian đi trễ:', timeErr);
            }
        }
        return baseScore + (isBookedViaApp ? 1 : 0) + (isPaidInAdvance ? 1 : 0) + lateModifier;
    }
    async remove(id, user = null) {
        const appointment = await this.findOne(id);
        if (user && user.role === 'PATIENT') {
            if (appointment.patient?.patientAccountId !== user.id) {
                throw new common_1.ForbiddenException('Bạn không có quyền xóa lịch khám của người khác!');
            }
        }
        await this.appointmentsRepo.remove(appointment);
        return { success: true, message: `Đã xóa lịch hẹn #${id} thành công` };
    }
    async logStatusChange(appointmentId, oldStatus, newStatus, changedBy = null, notes = null) {
        if (oldStatus === newStatus && !notes)
            return;
        await this.appointmentStatusLogsRepo.save({
            appointmentId,
            oldStatus: oldStatus,
            newStatus: newStatus,
            changedBy,
            notes,
        });
    }
    async cleanupPendingAppointments() {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const pendingAppointments = await this.appointmentsRepo.find({
            where: {
                status: 'PENDING',
                createdAt: (0, typeorm_2.LessThan)(fifteenMinutesAgo),
            },
        });
        if (pendingAppointments.length > 0) {
            for (const apt of pendingAppointments) {
                await this.appointmentsRepo.update(apt.id, { status: 'CANCELLED' });
                await this.logStatusChange(apt.id, 'PENDING', 'CANCELLED', null, 'Hệ thống tự động hủy do quá hạn chờ thanh toán VNPAY');
            }
            if (this.eventsGateway && this.eventsGateway.server) {
                this.eventsGateway.server.emit('appointments_updated');
            }
        }
    }
};
exports.AppointmentsService = AppointmentsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentsService.prototype, "cleanupPendingAppointments", null);
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Appointments_1.Appointments)),
    __param(1, (0, typeorm_1.InjectRepository)(Invoices_1.Invoices)),
    __param(2, (0, typeorm_1.InjectRepository)(AppointmentStatusLogs_1.AppointmentStatusLogs)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        mail_service_1.MailService,
        events_gateway_1.EventsGateway])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map