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
exports.DoctorProfiles = void 0;
const typeorm_1 = require("typeorm");
const Appointments_1 = require("./Appointments");
const Users_1 = require("./Users");
const Specialties_1 = require("./Specialties");
const DoctorSchedules_1 = require("./DoctorSchedules");
const Ratings_1 = require("./Ratings");
let DoctorProfiles = class DoctorProfiles {
    id;
    userId;
    specialtyId;
    fullName;
    avatarUrl;
    experienceYears;
    createdAt;
    total_reviews;
    average_rating;
    appointments;
    user;
    specialty;
    doctorSchedules;
    ratings;
};
exports.DoctorProfiles = DoctorProfiles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], DoctorProfiles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', unique: true }),
    __metadata("design:type", Number)
], DoctorProfiles.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'specialty_id' }),
    __metadata("design:type", Number)
], DoctorProfiles.prototype, "specialtyId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'full_name', length: 255 }),
    __metadata("design:type", String)
], DoctorProfiles.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], DoctorProfiles.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('int', {
        name: 'experience_years',
        nullable: true,
        default: '0',
    }),
    __metadata("design:type", Object)
], DoctorProfiles.prototype, "experienceYears", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], DoctorProfiles.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'total_reviews', default: 0 }),
    __metadata("design:type", Number)
], DoctorProfiles.prototype, "total_reviews", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'average_rating', precision: 3, scale: 1, default: 0.0 }),
    __metadata("design:type", Number)
], DoctorProfiles.prototype, "average_rating", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointments_1.Appointments, (appointments) => appointments.doctorProfile),
    __metadata("design:type", Array)
], DoctorProfiles.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Users_1.Users, (users) => users.doctorProfiles, {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], DoctorProfiles.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Specialties_1.Specialties, (specialties) => specialties.doctorProfiles, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'specialty_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Specialties_1.Specialties)
], DoctorProfiles.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DoctorSchedules_1.DoctorSchedules, (doctorSchedules) => doctorSchedules.doctorProfile),
    __metadata("design:type", Array)
], DoctorProfiles.prototype, "doctorSchedules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ratings_1.Ratings, (ratings) => ratings.doctor_profile),
    __metadata("design:type", Array)
], DoctorProfiles.prototype, "ratings", void 0);
exports.DoctorProfiles = DoctorProfiles = __decorate([
    (0, typeorm_1.Index)('user_id', ['userId'], { unique: true }),
    (0, typeorm_1.Index)('specialty_id', ['specialtyId'], {}),
    (0, typeorm_1.Entity)('doctor_profiles', { schema: 'clinic_flow_erp' })
], DoctorProfiles);
//# sourceMappingURL=DoctorProfiles.js.map