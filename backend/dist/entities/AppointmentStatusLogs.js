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
exports.AppointmentStatusLogs = void 0;
const typeorm_1 = require("typeorm");
const Appointments_1 = require("./Appointments");
const Users_1 = require("./Users");
let AppointmentStatusLogs = class AppointmentStatusLogs {
    id;
    appointmentId;
    oldStatus;
    newStatus;
    changedBy;
    changedAt;
    notes;
    appointment;
    changedBy2;
};
exports.AppointmentStatusLogs = AppointmentStatusLogs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], AppointmentStatusLogs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'appointment_id' }),
    __metadata("design:type", Number)
], AppointmentStatusLogs.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'old_status',
        nullable: true,
        enum: ['BOOKED', 'WAITING', 'EXAMINING', 'DOING_SERVICE', 'DONE', 'CANCELLED'],
    }),
    __metadata("design:type", Object)
], AppointmentStatusLogs.prototype, "oldStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'new_status',
        enum: ['BOOKED', 'WAITING', 'EXAMINING', 'DOING_SERVICE', 'DONE', 'CANCELLED'],
    }),
    __metadata("design:type", String)
], AppointmentStatusLogs.prototype, "newStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'changed_by', nullable: true }),
    __metadata("design:type", Object)
], AppointmentStatusLogs.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'changed_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AppointmentStatusLogs.prototype, "changedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'notes', length: 255, nullable: true }),
    __metadata("design:type", Object)
], AppointmentStatusLogs.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Appointments_1.Appointments, (appointments) => appointments.appointmentStatusLogs, { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)([{ name: 'appointment_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Appointments_1.Appointments)
], AppointmentStatusLogs.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.appointmentStatusLogs, {
        onDelete: 'SET NULL',
        onUpdate: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'changed_by', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], AppointmentStatusLogs.prototype, "changedBy2", void 0);
exports.AppointmentStatusLogs = AppointmentStatusLogs = __decorate([
    (0, typeorm_1.Index)('appointment_id', ['appointmentId'], {}),
    (0, typeorm_1.Index)('changed_by', ['changedBy'], {}),
    (0, typeorm_1.Entity)('appointment_status_logs', { schema: 'clinic_flow_erp' })
], AppointmentStatusLogs);
//# sourceMappingURL=AppointmentStatusLogs.js.map