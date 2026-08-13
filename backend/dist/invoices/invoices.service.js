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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Invoices_1 = require("../entities/Invoices");
const AppointmentServices_1 = require("../entities/AppointmentServices");
let InvoicesService = class InvoicesService {
    invoicesRepo;
    apptServicesRepo;
    constructor(invoicesRepo, apptServicesRepo) {
        this.invoicesRepo = invoicesRepo;
        this.apptServicesRepo = apptServicesRepo;
    }
    async getInvoiceDetails(appointmentId) {
        const invoice = await this.invoicesRepo.findOne({
            where: { appointmentId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Không tìm thấy hóa đơn cho lịch khám này');
        }
        const servicesList = await this.apptServicesRepo.find({
            where: { appointmentId },
            relations: { service: true },
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
                    price: BASE_FEE,
                },
                services: servicesList.map((item) => ({
                    id: item.id,
                    serviceId: item.serviceId,
                    name: item.service?.name,
                    snapshotPrice: Number(item.snapshotPrice),
                    quantity: item.quantity,
                })),
            },
        };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Invoices_1.Invoices)),
    __param(1, (0, typeorm_1.InjectRepository)(AppointmentServices_1.AppointmentServices)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map