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
exports.Invoices = void 0;
const typeorm_1 = require("typeorm");
const Appointments_1 = require("./Appointments");
let Invoices = class Invoices {
    id;
    appointmentId;
    totalAmount;
    status;
    paymentMethod;
    paidAt;
    createdAt;
    appointment;
};
exports.Invoices = Invoices;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Invoices.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'appointment_id', unique: true }),
    __metadata("design:type", Number)
], Invoices.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'total_amount', precision: 12, scale: 2 }),
    __metadata("design:type", String)
], Invoices.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'status',
        nullable: true,
        enum: ['UNPAID', 'PAID', 'CANCELLED'],
        default: 'UNPAID',
    }),
    __metadata("design:type", Object)
], Invoices.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'payment_method',
        nullable: true,
        enum: ['VNPAY', 'CASH'],
    }),
    __metadata("design:type", Object)
], Invoices.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { name: 'paid_at', nullable: true }),
    __metadata("design:type", Object)
], Invoices.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Invoices.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Appointments_1.Appointments, (appointments) => appointments.invoices, {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'appointment_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Appointments_1.Appointments)
], Invoices.prototype, "appointment", void 0);
exports.Invoices = Invoices = __decorate([
    (0, typeorm_1.Index)('appointment_id', ['appointmentId'], { unique: true }),
    (0, typeorm_1.Entity)('invoices', { schema: 'clinic_flow_erp' })
], Invoices);
//# sourceMappingURL=Invoices.js.map