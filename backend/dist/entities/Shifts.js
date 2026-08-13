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
exports.Shifts = void 0;
const typeorm_1 = require("typeorm");
const DoctorSchedules_1 = require("./DoctorSchedules");
let Shifts = class Shifts {
    id;
    name;
    startTime;
    endTime;
    doctorSchedules;
};
exports.Shifts = Shifts;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Shifts.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 50 }),
    __metadata("design:type", String)
], Shifts.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('time', { name: 'start_time' }),
    __metadata("design:type", String)
], Shifts.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)('time', { name: 'end_time' }),
    __metadata("design:type", String)
], Shifts.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DoctorSchedules_1.DoctorSchedules, (doctorSchedules) => doctorSchedules.shift),
    __metadata("design:type", Array)
], Shifts.prototype, "doctorSchedules", void 0);
exports.Shifts = Shifts = __decorate([
    (0, typeorm_1.Entity)('shifts', { schema: 'clinic_flow_erp' })
], Shifts);
//# sourceMappingURL=Shifts.js.map