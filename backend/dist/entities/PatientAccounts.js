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
exports.PatientAccounts = void 0;
const typeorm_1 = require("typeorm");
const Notifications_1 = require("./Notifications");
const Patients_1 = require("./Patients");
const Ratings_1 = require("./Ratings");
let PatientAccounts = class PatientAccounts {
    id;
    phone;
    email;
    passwordHash;
    isActive;
    otpCode;
    createdAt;
    notifications;
    patients;
    ratings;
};
exports.PatientAccounts = PatientAccounts;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], PatientAccounts.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'phone',
        unique: true,
        length: 20,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PatientAccounts.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'email',
        unique: true,
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], PatientAccounts.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'password_hash', length: 255 }),
    __metadata("design:type", String)
], PatientAccounts.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', {
        name: 'is_active',
        nullable: true,
        width: 1,
        default: '0',
    }),
    __metadata("design:type", Object)
], PatientAccounts.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'otp_code', length: 10, nullable: true }),
    __metadata("design:type", Object)
], PatientAccounts.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], PatientAccounts.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notifications_1.Notifications, (notifications) => notifications.patientAccount),
    __metadata("design:type", Array)
], PatientAccounts.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Patients_1.Patients, (patients) => patients.patientAccount),
    __metadata("design:type", Array)
], PatientAccounts.prototype, "patients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ratings_1.Ratings, (ratings) => ratings.patient_account),
    __metadata("design:type", Array)
], PatientAccounts.prototype, "ratings", void 0);
exports.PatientAccounts = PatientAccounts = __decorate([
    (0, typeorm_1.Index)('phone', ['phone'], { unique: true }),
    (0, typeorm_1.Entity)('patient_accounts', { schema: 'clinic_flow_erp' })
], PatientAccounts);
//# sourceMappingURL=PatientAccounts.js.map