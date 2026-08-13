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
exports.MedicalRecords = void 0;
const typeorm_1 = require("typeorm");
const Appointments_1 = require("./Appointments");
let MedicalRecords = class MedicalRecords {
    id;
    appointmentId;
    symptoms;
    diagnosis;
    notes;
    createdAt;
    appointment;
};
exports.MedicalRecords = MedicalRecords;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], MedicalRecords.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'appointment_id', unique: true }),
    __metadata("design:type", Number)
], MedicalRecords.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'symptoms' }),
    __metadata("design:type", String)
], MedicalRecords.prototype, "symptoms", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'diagnosis', nullable: true }),
    __metadata("design:type", Object)
], MedicalRecords.prototype, "diagnosis", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'notes', nullable: true }),
    __metadata("design:type", Object)
], MedicalRecords.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], MedicalRecords.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Appointments_1.Appointments, (appointments) => appointments.medicalRecords, {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'appointment_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Appointments_1.Appointments)
], MedicalRecords.prototype, "appointment", void 0);
exports.MedicalRecords = MedicalRecords = __decorate([
    (0, typeorm_1.Index)('appointment_id', ['appointmentId'], { unique: true }),
    (0, typeorm_1.Entity)('medical_records', { schema: 'clinic_flow_erp' })
], MedicalRecords);
//# sourceMappingURL=MedicalRecords.js.map