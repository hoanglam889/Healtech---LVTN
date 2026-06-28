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

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly vnpayService: VnpayService,
    @InjectRepository(Invoices) private invoicesRepo: Repository<Invoices>,
    @InjectRepository(Appointments)
    private appointmentsRepo: Repository<Appointments>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createPaymentUrl(invoiceId: string, amount: number): Promise<string> {
    const invoice = await this.invoicesRepo.findOne({
      where: { id: parseInt(invoiceId, 10) },
    });
    if (!invoice) {
      throw new BadRequestException('Không tìm thấy hóa đơn');
    }

    const totalAmount = amount || Number(invoice.totalAmount);
    const returnUrl = `http://localhost:3000/payments/vnpay-return`; // IPN webhook

    // Tạo TxnRef duy nhất: ID Hóa Đơn + Timestamp
    const txnRef = `${invoice.id}_${Date.now()}`;

    const urlString = this.vnpayService.buildPaymentUrl({
      vnp_Amount: totalAmount * 100, // VNPay yêu cầu nhân 100
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

    // Giao dịch thành công, cập nhật Invoices
    const invoice = await this.invoicesRepo.findOne({
      where: { id: invoiceId },
    });
    if (invoice) {
      invoice.status = 'PAID';
      invoice.paidAt = new Date();
      invoice.paymentMethod = 'VNPAY';
      await this.invoicesRepo.save(invoice);

      // PHÁT SÓNG: Hóa đơn thanh toán thành công qua VNPAY
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
}
