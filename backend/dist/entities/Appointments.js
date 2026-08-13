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
exports.Appointments = void 0;
const typeorm_1 = require("typeorm");
const Patients_1 = require("./Patients");
const DoctorProfiles_1 = require("./DoctorProfiles");
const AppointmentStatusLogs_1 = require("./AppointmentStatusLogs");
const Invoices_1 = require("./Invoices");
const MedicalRecords_1 = require("./MedicalRecords");
const AppointmentServices_1 = require("./AppointmentServices");
const Ratings_1 = require("./Ratings");
let Appointments = class Appointments {
    id;
    qrCode;
    patientId;
    doctorProfileId;
    appointmentDate;
    appointmentTime;
    status;
    priorityScore;
    createdAt;
    patient;
    doctorProfile;
    appointmentStatusLogs;
    invoices;
    medicalRecords;
    appointmentServices;
    rating;
};
exports.Appointments = Appointments;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Appointments.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'qr_code', unique: true, length: 100 }),
    __metadata("design:type", String)
], Appointments.prototype, "qrCode", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'patient_id' }),
    __metadata("design:type", Number)
], Appointments.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'doctor_profile_id', nullable: true }),
    __metadata("design:type", Object)
], Appointments.prototype, "doctorProfileId", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'appointment_date' }),
    __metadata("design:type", String)
], Appointments.prototype, "appointmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)('time', { name: 'appointment_time', nullable: true }),
    __metadata("design:type", Object)
], Appointments.prototype, "appointmentTime", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        name: 'status',
        nullable: true,
        enum: ['PENDING', 'BOOKED', 'WAITING', 'EXAMINING', 'DOING_SERVICE', 'DONE', 'CANCELLED'],
        default: 'BOOKED',
    }),
    __metadata("design:type", Object)
], Appointments.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        name: 'priority_score',
        nullable: true,
        default: '1',
    }),
    __metadata("design:type", Object)
], Appointments.prototype, "priorityScore", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Appointments.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Patients_1.Patients, (patients) => patients.appointments, {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'patient_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Patients_1.Patients)
], Appointments.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DoctorProfiles_1.DoctorProfiles, (doctorProfiles) => doctorProfiles.appointments, { onDelete: 'SET NULL', onUpdate: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)([{ name: 'doctor_profile_id', referencedColumnName: 'id' }]),
    __metadata("design:type", DoctorProfiles_1.DoctorProfiles)
], Appointments.prototype, "doctorProfile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AppointmentStatusLogs_1.AppointmentStatusLogs, (appointmentStatusLogs) => appointmentStatusLogs.appointment),
    __metadata("design:type", Array)
], Appointments.prototype, "appointmentStatusLogs", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Invoices_1.Invoices, (invoices) => invoices.appointment),
    __metadata("design:type", Invoices_1.Invoices)
], Appointments.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => MedicalRecords_1.MedicalRecords, (medicalRecords) => medicalRecords.appointment),
    __metadata("design:type", MedicalRecords_1.MedicalRecords)
], Appointments.prototype, "medicalRecords", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AppointmentServices_1.AppointmentServices, (appointmentServices) => appointmentServices.appointment),
    __metadata("design:type", Array)
], Appointments.prototype, "appointmentServices", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Ratings_1.Ratings, (ratings) => ratings.appointment),
    __metadata("design:type", Ratings_1.Ratings)
], Appointments.prototype, "rating", void 0);
exports.Appointments = Appointments = __decorate([
    (0, typeorm_1.Index)('qr_code', ['qrCode'], { unique: true }),
    (0, typeorm_1.Index)('patient_id', ['patientId'], {}),
    (0, typeorm_1.Index)('doctor_profile_id', ['doctorProfileId'], {}),
    (0, typeorm_1.Entity)('appointments', { schema: 'clinic_flow_erp' })
], Appointments);
//# sourceMappingURL=Appointments.js.map