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
exports.DoctorSchedules = void 0;
const typeorm_1 = require("typeorm");
const DoctorProfiles_1 = require("./DoctorProfiles");
const Shifts_1 = require("./Shifts");
let DoctorSchedules = class DoctorSchedules {
    id;
    doctorProfileId;
    shiftId;
    date;
    maxPatients;
    createdAt;
    doctorProfile;
    shift;
};
exports.DoctorSchedules = DoctorSchedules;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], DoctorSchedules.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'doctor_profile_id' }),
    __metadata("design:type", Number)
], DoctorSchedules.prototype, "doctorProfileId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'shift_id' }),
    __metadata("design:type", Number)
], DoctorSchedules.prototype, "shiftId", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'date' }),
    __metadata("design:type", String)
], DoctorSchedules.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'max_patients', nullable: true, default: '5' }),
    __metadata("design:type", Object)
], DoctorSchedules.prototype, "maxPatients", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], DoctorSchedules.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DoctorProfiles_1.DoctorProfiles, (doctorProfiles) => doctorProfiles.doctorSchedules, { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)([{ name: 'doctor_profile_id', referencedColumnName: 'id' }]),
    __metadata("design:type", DoctorProfiles_1.DoctorProfiles)
], DoctorSchedules.prototype, "doctorProfile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Shifts_1.Shifts, (shifts) => shifts.doctorSchedules, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'shift_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Shifts_1.Shifts)
], DoctorSchedules.prototype, "shift", void 0);
exports.DoctorSchedules = DoctorSchedules = __decorate([
    (0, typeorm_1.Index)('doctor_profile_id', ['doctorProfileId'], {}),
    (0, typeorm_1.Index)('shift_id', ['shiftId'], {}),
    (0, typeorm_1.Entity)('doctor_schedules', { schema: 'clinic_flow_erp' })
], DoctorSchedules);
//# sourceMappingURL=DoctorSchedules.js.map