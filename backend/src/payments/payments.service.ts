import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ReturnQueryFromVNPay,
  VerifyReturnUrl,
  ProductCode,
} from 'vnpay';
import { VnpayService } from 'nestjs-vnpay';
import { Invoices } from '../entities/Invoices';
import { Appointments } from '../entities/Appointments';
import { EventsGateway } from '../events/events.gateway';
import { MailService } from '../mail/mail.service';
import { Patients } from '../entities/Patients';

import { AppointmentStatusLogs } from '../entities/AppointmentStatusLogs';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly vnpayService: VnpayService,
    @InjectRepository(Invoices) private invoicesRepo: Repository<Invoices>,
    @InjectRepository(Appointments)
    private appointmentsRepo: Repository<Appointments>,
    @InjectRepository(AppointmentStatusLogs)
    private appointmentStatusLogsRepo: Repository<AppointmentStatusLogs>,
    private readonly eventsGateway: EventsGateway,
    private readonly mailService: MailService,
  ) {}

  async createPaymentUrl(invoiceId: string, amount: number, source?: string): Promise<string> {
    const invoice = await this.invoicesRepo.findOne({
      where: { id: parseInt(invoiceId, 10) },
    });
    if (!invoice) {
      throw new BadRequestException('Không tìm thấy hóa đơn');
    }

    const totalAmount = amount || Number(invoice.totalAmount);
    let backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    if (backendUrl.includes('14.225.218.191')) {
      backendUrl = 'https://healtech-api.duckdns.org';
    }
    const returnUrl = `${backendUrl}/payments/vnpay-return${source ? '?source=' + source : ''}`; // IPN webhook

    // Tạo TxnRef duy nhất: ID Hóa Đơn + Timestamp
    const txnRef = `${invoice.id}_${Date.now()}`;

    const urlString = this.vnpayService.buildPaymentUrl({
      vnp_Amount: totalAmount, // nestjs-vnpay v2+ tự động xử lý nhân 100
      vnp_IpAddr: '127.0.0.1',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan hoa don ${invoice.id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: returnUrl,
    });

    return urlString;
  }

  async vnpayReturn(query: ReturnQueryFromVNPay): Promise<{
    status: string;
    invoiceId: string;
    amount: string;
    message: string;
  }> {
    let verify: VerifyReturnUrl;
    try {
      verify = await this.vnpayService.verifyReturnUrl(query);
    } catch (error) {
      this.logger.error('Lỗi xác thực chữ ký VNPAY', error);
      return {
        status: 'failed',
        invoiceId: query.vnp_TxnRef,
        amount: (Number(query.vnp_Amount) / 100).toString(),
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
        amount: Number(vnp_Amount).toString(),
        message: 'Giao dịch không thành công',
      };
    }

    // Giao dịch thành công, cập nhật Invoices
    const invoice = await this.invoicesRepo.findOne({
      where: { id: invoiceId },
    });
    if (invoice) {
      invoice.status = 'PAID';
      invoice.paidAt = new Date();
      invoice.paymentMethod = 'VNPAY';
      await this.invoicesRepo.save(invoice);

      // Cập nhật trạng thái lịch khám từ PENDING sang BOOKED
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

          // Ghi log trạng thái thanh toán
          await this.appointmentStatusLogsRepo.save({
            appointmentId: appointment.id,
            oldStatus: oldStatus as any,
            newStatus: 'BOOKED' as any,
            changedBy: null, // Hệ thống tự động
            notes: 'Thanh toán thành công qua VNPAY',
          });

          // Phát sóng báo lễ tân có lịch mới
          this.eventsGateway.emitUpdate('appointment_created', { 
            appointmentId: appointment.id 
          });

          // Gửi mail thông báo đặt lịch thành công
          if (appointment.patient?.patientAccount?.email) {
            try {
              const accountOwner = await this.appointmentsRepo.manager
                .createQueryBuilder(Patients, 'p')
                .where('p.patientAccountId = :accountId', {
                  accountId: appointment.patient.patientAccountId,
                })
                .andWhere('p.relationship = :rel', { rel: 'Bản thân' })
                .getOne();

              const accountName = accountOwner ? accountOwner.fullName : 'Bệnh nhân';
              
              // Giả sử có lấy được giờ khám (startTime)
              const startTime = appointment.appointmentTime || '';

              this.mailService.sendBookingSuccess(
                appointment.patient.patientAccount.email,
                appointment.qrCode,
                appointment.appointmentDate,
                startTime,
                accountName,
                appointment.patient.fullName,
              ).catch(e => this.logger.error('Lỗi gửi mail VNPAY:', e));
            } catch (err) {
              this.logger.error('Lỗi truy vấn gửi mail VNPAY:', err);
            }
          }
        }
      }

      // PHÁT SÓNG: Hóa đơn thanh toán thành công qua VNPAY
      this.eventsGateway.emitUpdate('invoice_paid', { invoiceId: invoice.id });

      return {
        status: 'success',
        invoiceId: invoiceIdStr,
        amount: Number(vnp_Amount).toString(),
        message: 'Thanh toán thành công',
      };
    }

    return {
      status: 'failed',
      invoiceId: invoiceIdStr,
      amount: Number(vnp_Amount).toString(),
      message: 'Hóa đơn không tồn tại',
    };
  }
}
