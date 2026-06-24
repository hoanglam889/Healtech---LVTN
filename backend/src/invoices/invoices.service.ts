import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoices } from '../entities/Invoices';
import { AppointmentServices } from '../entities/AppointmentServices';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoices)
    private readonly invoicesRepo: Repository<Invoices>,
    @InjectRepository(AppointmentServices)
    private readonly apptServicesRepo: Repository<AppointmentServices>,
  ) {}

  async getInvoiceDetails(appointmentId: number) {
    const invoice = await this.invoicesRepo.findOne({
      where: { appointmentId }
    });

    if (!invoice) {
      throw new NotFoundException('Không tìm thấy hóa đơn cho lịch khám này');
    }

    // Lấy danh sách dịch vụ
    const servicesList = await this.apptServicesRepo.find({
      where: { appointmentId },
      relations: { service: true }
    });

    const BASE_FEE = 150000;

    return {
      id: invoice.id,
      appointmentId: invoice.appointmentId,
      status: invoice.status,
      totalAmount: invoice.totalAmount,
      createdAt: invoice.createdAt,
      paidAt: invoice.paidAt,
      paymentMethod: invoice.paymentMethod,
      breakdown: {
        examFee: {
          name: 'Phí thăm khám ban đầu',
          price: BASE_FEE
        },
        services: servicesList.map(item => ({
          id: item.id,
          serviceId: item.serviceId,
          name: item.service?.name,
          snapshotPrice: Number(item.snapshotPrice),
          quantity: item.quantity
        }))
      }
    };
  }
}
