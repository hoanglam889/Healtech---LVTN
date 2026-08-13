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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentServices = void 0;
const typeorm_1 = require("typeorm");
const Appointments_1 = require("./Appointments");
const Services_1 = require("./Services");
let AppointmentServices = class AppointmentServices {
    id;
    appointmentId;
    serviceId;
    quantity;
    snapshotPrice;
    createdAt;
    appointment;
    service;
};
exports.AppointmentServices = AppointmentServices;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], AppointmentServices.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'appointment_id' }),
    __metadata("design:type", Number)
], AppointmentServices.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'service_id' }),
    __metadata("design:type", Number)
], AppointmentServices.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'quantity', nullable: true, default: '1' }),
    __metadata("design:type", Object)
], AppointmentServices.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'snapshot_price', precision: 12, scale: 2 }),
    __metadata("design:type", String)
], AppointmentServices.prototype, "snapshotPrice", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AppointmentServices.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Appointments_1.Appointments, (appointments) => appointments.appointmentServices, { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)([{ name: 'appointment_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Appointments_1.Appointments)
], AppointmentServices.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Services_1.Services, (services) => services.appointmentServices, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'service_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Services_1.Services)
], AppointmentServices.prototype, "service", void 0);
exports.AppointmentServices = AppointmentServices = __decorate([
    (0, typeorm_1.Index)('appointment_id', ['appointmentId'], {}),
    (0, typeorm_1.Index)('service_id', ['serviceId'], {}),
    (0, typeorm_1.Entity)('appointment_services', { schema: 'clinic_flow_erp' })
], AppointmentServices);
//# sourceMappingURL=AppointmentServices.js.map