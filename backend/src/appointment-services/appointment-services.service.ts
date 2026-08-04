import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAppointmentServiceDto } from './dto/create-appointment-service.dto';
import { UpdateAppointmentServiceDto } from './dto/update-appointment-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentServices } from '../entities/AppointmentServices';
import { DataSource, Repository } from 'typeorm';
import { Services } from '../entities/Services';
import { Invoices } from '../entities/Invoices';
import { Appointments } from '../entities/Appointments';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class AppointmentServicesService {
  constructor(
    @InjectRepository(AppointmentServices)
    private readonly apptServicesRepo: Repository<AppointmentServices>,
    private dataSource: DataSource,
     private eventsGateway: EventsGateway,
  ) {}

  // Helper tính toán lại tổng tiền Hóa đơn
  async recalculateInvoiceTotal(
    appointmentId: number,
    queryRunner: any = null,
  ) {
    const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;

    // Lấy tất cả dịch vụ của lịch khám này
    const services = await manager.find(AppointmentServices, {
      where: { appointmentId },
    });

    // Tính tổng tiền các dịch vụ
    const servicesTotal = services.reduce((sum, item) => {
      return sum + Number(item.snapshotPrice) * (item.quantity || 1);
    }, 0);

    // Tiền khám gốc
    const BASE_FEE = 150000;
    const finalTotal = BASE_FEE + servicesTotal;

    // Cập nhật hóa đơn
    const invoice = await manager.findOne(Invoices, {
      where: { appointmentId },
    });
    const appt = await manager.findOne(Appointments, {
      where: { id: appointmentId },
    });

    if (invoice && appt) {
      invoice.totalAmount = finalTotal.toString();
      
      // Nếu ca khám không phải PENDING (tức là đã thu tiền khám 150k ban đầu)
      if (appt.status !== 'PENDING') {
        // Nếu có dịch vụ phát sinh -> Chuyển về UNPAID để thu thêm
        if (finalTotal > BASE_FEE) {
          invoice.status = 'UNPAID';
        } else {
          // Nếu xóa hết dịch vụ phát sinh -> Chuyển lại về PAID
          invoice.status = 'PAID';
        }
      }

      await manager.save(Invoices, invoice);
    }
  }

  async create(dto: CreateAppointmentServiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Kiểm tra hóa đơn
      const invoice = await queryRunner.manager.findOne(Invoices, {
        where: { appointmentId: dto.appointmentId },
      });

      if (!invoice) {
        throw new BadRequestException('Hóa đơn không tồn tại!');
      }

      if (invoice.status === 'CANCELLED') {
        throw new BadRequestException(
          'Không thể thêm dịch vụ vào hóa đơn Đã hủy!',
        );
      }

      // 2. Lấy thông tin giá dịch vụ gốc
      const serviceInfo = await queryRunner.manager.findOne(Services, {
        where: { id: dto.serviceId, isActive: true },
      });

      if (!serviceInfo) {
        throw new BadRequestException(
          'Dịch vụ không tồn tại hoặc đã ngừng hoạt động!',
        );
      }

      // 3. Kiểm tra xem dịch vụ này đã có trong lịch khám chưa
      const existingService = await queryRunner.manager.findOne(
        AppointmentServices,
        {
          where: { appointmentId: dto.appointmentId, serviceId: dto.serviceId },
        },
      );

      if (existingService) {
        throw new BadRequestException(
          'Dịch vụ này đã được thêm vào lịch khám! Vui lòng dùng tính năng Cập nhật số lượng.',
        );
      }

      // 4. Lưu dịch vụ mới
      const newApptService = queryRunner.manager.create(AppointmentServices, {
        appointmentId: dto.appointmentId,
        serviceId: dto.serviceId,
        quantity: dto.quantity || 1,
        snapshotPrice: serviceInfo.price,
      });
      await queryRunner.manager.save(AppointmentServices, newApptService);

      // 5. Tính toán lại tổng tiền hóa đơn (Truyền queryRunner vào để giữ transaction)
      await this.recalculateInvoiceTotal(dto.appointmentId, queryRunner);

      // Lưu transaction
      await queryRunner.commitTransaction();
      //bắn socket
      this.eventsGateway.emitUpdate('invoice_created', { 
        appointmentId: dto.appointmentId 
      });
      return newApptService;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all appointmentServices`;
  }

  async findByAppointment(appointmentId: number) {
    return await this.apptServicesRepo.find({
      where: { appointmentId: appointmentId },
      relations: {
        service: true, // Lấy luôn thông tin chi tiết của dịch vụ (Tên, Giá)
      },
    });
  }

  async update(id: number, dto: UpdateAppointmentServiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingService = await queryRunner.manager.findOne(
        AppointmentServices,
        { where: { id } },
      );
      if (!existingService)
        throw new BadRequestException(
          'Không tìm thấy dịch vụ trong lịch khám này!',
        );

      // Check invoice status
      const invoice = await queryRunner.manager.findOne(Invoices, {
        where: { appointmentId: existingService.appointmentId },
      });
      if (
        invoice &&
        invoice.status === 'CANCELLED'
      ) {
        throw new BadRequestException(
          'Không thể sửa số lượng vì Hóa đơn Đã hủy!',
        );
      }

      // Update quantity
      if (dto.quantity !== undefined) {
        existingService.quantity = dto.quantity;
        await queryRunner.manager.save(AppointmentServices, existingService);
      }

      // Recalculate
      await this.recalculateInvoiceTotal(
        existingService.appointmentId,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return existingService;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingService = await queryRunner.manager.findOne(
        AppointmentServices,
        { where: { id } },
      );
      if (!existingService)
        throw new BadRequestException(
          'Không tìm thấy dịch vụ trong lịch khám này!',
        );

      // Check invoice status
      const invoice = await queryRunner.manager.findOne(Invoices, {
        where: { appointmentId: existingService.appointmentId },
      });
      if (
        invoice &&
        invoice.status === 'CANCELLED'
      ) {
        throw new BadRequestException(
          'Không thể xóa dịch vụ vì Hóa đơn Đã hủy!',
        );
      }

      const appointmentId = existingService.appointmentId;

      // Delete (Hard delete since it's just an item in cart)
      await queryRunner.manager.remove(AppointmentServices, existingService);

      // Recalculate
      await this.recalculateInvoiceTotal(appointmentId, queryRunner);

      await queryRunner.commitTransaction();
      return { message: 'Đã xóa dịch vụ thành công' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
