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
exports.AppointmentServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const AppointmentServices_1 = require("../entities/AppointmentServices");
const typeorm_2 = require("typeorm");
const Services_1 = require("../entities/Services");
const Invoices_1 = require("../entities/Invoices");
const Appointments_1 = require("../entities/Appointments");
const events_gateway_1 = require("../events/events.gateway");
let AppointmentServicesService = class AppointmentServicesService {
    apptServicesRepo;
    dataSource;
    eventsGateway;
    constructor(apptServicesRepo, dataSource, eventsGateway) {
        this.apptServicesRepo = apptServicesRepo;
        this.dataSource = dataSource;
        this.eventsGateway = eventsGateway;
    }
    async recalculateInvoiceTotal(appointmentId, queryRunner = null) {
        const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
        const services = await manager.find(AppointmentServices_1.AppointmentServices, {
            where: { appointmentId },
        });
        const servicesTotal = services.reduce((sum, item) => {
            return sum + Number(item.snapshotPrice) * (item.quantity || 1);
        }, 0);
        const BASE_FEE = 150000;
        const finalTotal = BASE_FEE + servicesTotal;
        const invoice = await manager.findOne(Invoices_1.Invoices, {
            where: { appointmentId },
        });
        const appt = await manager.findOne(Appointments_1.Appointments, {
            where: { id: appointmentId },
        });
        if (invoice && appt) {
            invoice.totalAmount = finalTotal.toString();
            if (appt.status !== 'PENDING') {
                if (finalTotal > BASE_FEE) {
                    invoice.status = 'UNPAID';
                }
                else {
                    invoice.status = 'PAID';
                }
            }
            await manager.save(Invoices_1.Invoices, invoice);
        }
    }
    async create(dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invoice = await queryRunner.manager.findOne(Invoices_1.Invoices, {
                where: { appointmentId: dto.appointmentId },
            });
            if (!invoice) {
                throw new common_1.BadRequestException('Hóa đơn không tồn tại!');
            }
            if (invoice.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Không thể thêm dịch vụ vào hóa đơn Đã hủy!');
            }
            const serviceInfo = await queryRunner.manager.findOne(Services_1.Services, {
                where: { id: dto.serviceId, isActive: true },
            });
            if (!serviceInfo) {
                throw new common_1.BadRequestException('Dịch vụ không tồn tại hoặc đã ngừng hoạt động!');
            }
            const existingService = await queryRunner.manager.findOne(AppointmentServices_1.AppointmentServices, {
                where: { appointmentId: dto.appointmentId, serviceId: dto.serviceId },
            });
            if (existingService) {
                throw new common_1.BadRequestException('Dịch vụ này đã được thêm vào lịch khám! Vui lòng dùng tính năng Cập nhật số lượng.');
            }
            const newApptService = queryRunner.manager.create(AppointmentServices_1.AppointmentServices, {
                appointmentId: dto.appointmentId,
                serviceId: dto.serviceId,
                quantity: dto.quantity || 1,
                snapshotPrice: serviceInfo.price,
            });
            await queryRunner.manager.save(AppointmentServices_1.AppointmentServices, newApptService);
            await this.recalculateInvoiceTotal(dto.appointmentId, queryRunner);
            await queryRunner.commitTransaction();
            this.eventsGateway.emitUpdate('invoice_created', {
                appointmentId: dto.appointmentId
            });
            return newApptService;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    findAll() {
        return `This action returns all appointmentServices`;
    }
    async findByAppointment(appointmentId) {
        return await this.apptServicesRepo.find({
            where: { appointmentId: appointmentId },
            relations: {
                service: true,
            },
        });
    }
    async update(id, dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingService = await queryRunner.manager.findOne(AppointmentServices_1.AppointmentServices, { where: { id } });
            if (!existingService)
                throw new common_1.BadRequestException('Không tìm thấy dịch vụ trong lịch khám này!');
            const invoice = await queryRunner.manager.findOne(Invoices_1.Invoices, {
                where: { appointmentId: existingService.appointmentId },
            });
            if (invoice &&
                invoice.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Không thể sửa số lượng vì Hóa đơn Đã hủy!');
            }
            if (dto.quantity !== undefined) {
                existingService.quantity = dto.quantity;
                await queryRunner.manager.save(AppointmentServices_1.AppointmentServices, existingService);
            }
            await this.recalculateInvoiceTotal(existingService.appointmentId, queryRunner);
            await queryRunner.commitTransaction();
            return existingService;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingService = await queryRunner.manager.findOne(AppointmentServices_1.AppointmentServices, { where: { id } });
            if (!existingService)
                throw new common_1.BadRequestException('Không tìm thấy dịch vụ trong lịch khám này!');
            const invoice = await queryRunner.manager.findOne(Invoices_1.Invoices, {
                where: { appointmentId: existingService.appointmentId },
            });
            if (invoice &&
                invoice.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Không thể xóa dịch vụ vì Hóa đơn Đã hủy!');
            }
            const appointmentId = existingService.appointmentId;
            await queryRunner.manager.remove(AppointmentServices_1.AppointmentServices, existingService);
            await this.recalculateInvoiceTotal(appointmentId, queryRunner);
            await queryRunner.commitTransaction();
            return { message: 'Đã xóa dịch vụ thành công' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AppointmentServicesService = AppointmentServicesService;
exports.AppointmentServicesService = AppointmentServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(AppointmentServices_1.AppointmentServices)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        events_gateway_1.EventsGateway])
], AppointmentServicesService);
//# sourceMappingURL=appointment-services.service.js.map