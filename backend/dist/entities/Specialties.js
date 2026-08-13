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
exports.Specialties = void 0;
const typeorm_1 = require("typeorm");
const DoctorProfiles_1 = require("./DoctorProfiles");
let Specialties = class Specialties {
    id;
    name;
    icon;
    description;
    createdAt;
    doctorProfiles;
};
exports.Specialties = Specialties;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Specialties.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 255 }),
    __metadata("design:type", String)
], Specialties.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'icon', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Specialties.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'description', nullable: true }),
    __metadata("design:type", Object)
], Specialties.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Specialties.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DoctorProfiles_1.DoctorProfiles, (doctorProfiles) => doctorProfiles.specialty),
    __metadata("design:type", Array)
], Specialties.prototype, "doctorProfiles", void 0);
exports.Specialties = Specialties = __decorate([
    (0, typeorm_1.Entity)('specialties', { schema: 'clinic_flow_erp' })
], Specialties);
//# sourceMappingURL=Specialties.js.map