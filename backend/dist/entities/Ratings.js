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
exports.Ratings = void 0;
const typeorm_1 = require("typeorm");
const Appointments_1 = require("./Appointments");
const DoctorProfiles_1 = require("./DoctorProfiles");
const PatientAccounts_1 = require("./PatientAccounts");
let Ratings = class Ratings {
    id;
    appointment_id;
    doctor_profile_id;
    patient_account_id;
    rating;
    comment;
    created_at;
    appointment;
    doctor_profile;
    patient_account;
};
exports.Ratings = Ratings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Ratings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'appointment_id' }),
    __metadata("design:type", Number)
], Ratings.prototype, "appointment_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'doctor_profile_id' }),
    __metadata("design:type", Number)
], Ratings.prototype, "doctor_profile_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'patient_account_id' }),
    __metadata("design:type", Number)
], Ratings.prototype, "patient_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'rating' }),
    __metadata("design:type", Number)
], Ratings.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'comment', nullable: true }),
    __metadata("design:type", Object)
], Ratings.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Ratings.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Appointments_1.Appointments, (appointments) => appointments.rating, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'appointment_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Appointments_1.Appointments)
], Ratings.prototype, "appointment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DoctorProfiles_1.DoctorProfiles, (doctorProfiles) => doctorProfiles.ratings, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'doctor_profile_id', referencedColumnName: 'id' }]),
    __metadata("design:type", DoctorProfiles_1.DoctorProfiles)
], Ratings.prototype, "doctor_profile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PatientAccounts_1.PatientAccounts, (patientAccounts) => patientAccounts.ratings, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'patient_account_id', referencedColumnName: 'id' }]),
    __metadata("design:type", PatientAccounts_1.PatientAccounts)
], Ratings.prototype, "patient_account", void 0);
exports.Ratings = Ratings = __decorate([
    (0, typeorm_1.Index)('uk_ratings_appointment_id', ['appointment_id'], { unique: true }),
    (0, typeorm_1.Index)('idx_ratings_doctor_id', ['doctor_profile_id'], {}),
    (0, typeorm_1.Index)('idx_ratings_patient_id', ['patient_account_id'], {}),
    (0, typeorm_1.Entity)('ratings', { schema: 'clinic_flow_erp' })
], Ratings);
//# sourceMappingURL=Ratings.js.map