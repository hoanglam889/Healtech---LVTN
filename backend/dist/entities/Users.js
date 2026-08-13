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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const AppointmentStatusLogs_1 = require("./AppointmentStatusLogs");
const DoctorProfiles_1 = require("./DoctorProfiles");
const Articles_1 = require("./Articles");
let Users = class Users {
    id;
    phone;
    email;
    passwordHash;
    role;
    isActive;
    createdAt;
    appointmentStatusLogs;
    doctorProfiles;
    articles;
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'phone', unique: true, length: 20 }),
    __metadata("design:type", String)
], Users.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'email',
        unique: true,
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'password_hash', length: 255 }),
    __metadata("design:type", String)
], Users.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { name: 'role', enum: ['ADMIN', 'DOCTOR', 'STAFF'] }),
    __metadata("design:type", String)
], Users.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', {
        name: 'is_active',
        nullable: true,
        width: 1,
        default: '1',
    }),
    __metadata("design:type", Object)
], Users.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AppointmentStatusLogs_1.AppointmentStatusLogs, (appointmentStatusLogs) => appointmentStatusLogs.changedBy2),
    __metadata("design:type", Array)
], Users.prototype, "appointmentStatusLogs", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => DoctorProfiles_1.DoctorProfiles, (doctorProfiles) => doctorProfiles.user),
    __metadata("design:type", DoctorProfiles_1.DoctorProfiles)
], Users.prototype, "doctorProfiles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Articles_1.Articles, (articles) => articles.user),
    __metadata("design:type", Array)
], Users.prototype, "articles", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Index)('phone', ['phone'], { unique: true }),
    (0, typeorm_1.Entity)('users', { schema: 'clinic_flow_erp' })
], Users);
//# sourceMappingURL=Users.js.map