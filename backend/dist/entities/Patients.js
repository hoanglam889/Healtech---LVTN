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
exports.Patients = void 0;
const typeorm_1 = require("typeorm");
const Appointments_1 = require("./Appointments");
const PatientAccounts_1 = require("./PatientAccounts");
let Patients = class Patients {
    id;
    patientAccountId;
    relationship;
    cccd;
    fullName;
    dob;
    gender;
    phone;
    address;
    isCompleted;
    createdAt;
    appointments;
    patientAccount;
};
exports.Patients = Patients;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Patients.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'patient_account_id', nullable: true }),
    __metadata("design:type", Object)
], Patients.prototype, "patientAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'relationship',
        nullable: true,
        length: 50,
        default: 'Bản thân',
    }),
    __metadata("design:type", Object)
], Patients.prototype, "relationship", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'cccd', nullable: true, unique: true, length: 20 }),
    __metadata("design:type", Object)
], Patients.prototype, "cccd", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'full_name', length: 255 }),
    __metadata("design:type", String)
], Patients.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'dob' }),
    __metadata("design:type", String)
], Patients.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { name: 'gender', enum: ['MALE', 'FEMALE', 'OTHER'] }),
    __metadata("design:type", String)
], Patients.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phone', nullable: true, length: 20 }),
    __metadata("design:type", Object)
], Patients.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'address', nullable: true, length: 255 }),
    __metadata("design:type", Object)
], Patients.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'is_completed', default: false }),
    __metadata("design:type", Boolean)
], Patients.prototype, "isCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Patients.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointments_1.Appointments, (appointments) => appointments.patient),
    __metadata("design:type", Array)
], Patients.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PatientAccounts_1.PatientAccounts, (patientAccounts) => patientAccounts.patients, { onDelete: 'SET NULL', onUpdate: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)([{ name: 'patient_account_id', referencedColumnName: 'id' }]),
    __metadata("design:type", PatientAccounts_1.PatientAccounts)
], Patients.prototype, "patientAccount", void 0);
exports.Patients = Patients = __decorate([
    (0, typeorm_1.Index)('cccd', ['cccd'], { unique: true }),
    (0, typeorm_1.Index)('patient_account_id', ['patientAccountId'], {}),
    (0, typeorm_1.Entity)('patients', { schema: 'clinic_flow_erp' })
], Patients);
//# sourceMappingURL=Patients.js.map