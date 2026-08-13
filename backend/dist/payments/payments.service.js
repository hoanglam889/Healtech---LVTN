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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vnpay_1 = require("vnpay");
const nestjs_vnpay_1 = require("nestjs-vnpay");
const Invoices_1 = require("../entities/Invoices");
const Appointments_1 = require("../entities/Appointments");
const events_gateway_1 = require("../events/events.gateway");
const mail_service_1 = require("../mail/mail.service");
const Patients_1 = require("../entities/Patients");
const AppointmentStatusLogs_1 = require("../entities/AppointmentStatusLogs");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    vnpayService;
    invoicesRepo;
    appointmentsRepo;
    appointmentStatusLogsRepo;
    eventsGateway;
    mailService;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(vnpayService, invoicesRepo, appointmentsRepo, appointmentStatusLogsRepo, eventsGateway, mailService) {
        this.vnpayService = vnpayService;
        this.invoicesRepo = invoicesRepo;
        this.appointmentsRepo = appointmentsRepo;
        this.appointmentStatusLogsRepo = appointmentStatusLogsRepo;
        this.eventsGateway = eventsGateway;
        this.mailService = mailService;
    }
    async createPaymentUrl(invoiceId, amount, source) {
        const invoice = await this.invoicesRepo.findOne({
            where: { id: parseInt(invoiceId, 10) },
        });
        if (!invoice) {
            throw new common_1.BadRequestException('Không tìm thấy hóa đơn');
        }
        const totalAmount = amount || Number(invoice.totalAmount);
        const returnUrl = `http://localhost:3000/payments/vnpay-return${source ? '?source=' + source : ''}`;
        const txnRef = `${invoice.id}_${Date.now()}`;
        const urlString = this.vnpayService.buildPaymentUrl({
            vnp_Amount: totalAmount,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: `Thanh toan hoa don ${invoice.id}`,
            vnp_OrderType: vnpay_1.ProductCode.Other,
            vnp_ReturnUrl: returnUrl,
        });
        return urlString;
    }
    async vnpayReturn(query) {
        let verify;
        try {
            verify = await this.vnpayService.verifyReturnUrl(query);
        }
        catch (error) {
            this.logger.error('Lỗi xác thực chữ ký VNPAY', error);
            return {
                status: 'failed',
                invoiceId: query.vnp_TxnRef,
                amount: query.vnp_Amount.toString(),
                message: 'Chữ ký không hợp lệ',
            };
        }
        const { isSuccess, vnp_TxnRef, vnp_Amount } = verify;
        const invoiceIdStr = vnp_TxnRef.split('_')[0];
        const invoiceId = parseInt(invoiceIdStr, 10);
        if (!isSuccess) {
            return {
                status: 'failed',
                invoiceId: invoiceIdStr,
                amount: (Number(vnp_Amount) / 100).toString(),
                message: 'Giao dịch không thành công',
            };
        }
        const invoice = await this.invoicesRepo.findOne({
            where: { id: invoiceId },
        });
        if (invoice) {
            invoice.status = 'PAID';
            invoice.paidAt = new Date();
            invoice.paymentMethod = 'VNPAY';
            await this.invoicesRepo.save(invoice);
            if (invoice.appointmentId) {
                const appointment = await this.appointmentsRepo.findOne({
                    where: { id: invoice.appointmentId },
                    relations: {
                        patient: {
                            patientAccount: true,
                        },
                        doctorProfile: {
                            specialty: true,
                            user: true,
                        },
                    },
                });
                if (appointment && appointment.status === 'PENDING') {
                    const oldStatus = appointment.status;
                    appointment.status = 'BOOKED';
                    await this.appointmentsRepo.save(appointment);
                    await this.appointmentStatusLogsRepo.save({
                        appointmentId: appointment.id,
                        oldStatus: oldStatus,
                        newStatus: 'BOOKED',
                        changedBy: null,
                        notes: 'Thanh toán thành công qua VNPAY',
                    });
                    this.eventsGateway.emitUpdate('appointment_created', {
                        appointmentId: appointment.id
                    });
                    if (appointment.patient?.patientAccount?.email) {
                        try {
                            const accountOwner = await this.appointmentsRepo.manager
                                .createQueryBuilder(Patients_1.Patients, 'p')
                                .where('p.patientAccountId = :accountId', {
                                accountId: appointment.patient.patientAccountId,
                            })
                                .andWhere('p.relationship = :rel', { rel: 'Bản thân' })
                                .getOne();
                            const accountName = accountOwner ? accountOwner.fullName : 'Bệnh nhân';
                            const startTime = appointment.appointmentTime || '';
                            this.mailService.sendBookingSuccess(appointment.patient.patientAccount.email, appointment.qrCode, appointment.appointmentDate, startTime, accountName, appointment.patient.fullName).catch(e => this.logger.error('Lỗi gửi mail VNPAY:', e));
                        }
                        catch (err) {
                            this.logger.error('Lỗi truy vấn gửi mail VNPAY:', err);
                        }
                    }
                }
            }
            this.eventsGateway.emitUpdate('invoice_paid', { invoiceId: invoice.id });
            return {
                status: 'success',
                invoiceId: invoiceIdStr,
                amount: (Number(vnp_Amount) / 100).toString(),
                message: 'Thanh toán thành công',
            };
        }
        return {
            status: 'failed',
            invoiceId: invoiceIdStr,
            amount: (Number(vnp_Amount) / 100).toString(),
            message: 'Hóa đơn không tồn tại',
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Invoices_1.Invoices)),
    __param(2, (0, typeorm_1.InjectRepository)(Appointments_1.Appointments)),
    __param(3, (0, typeorm_1.InjectRepository)(AppointmentStatusLogs_1.AppointmentStatusLogs)),
    __metadata("design:paramtypes", [nestjs_vnpay_1.VnpayService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        events_gateway_1.EventsGateway,
        mail_service_1.MailService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map