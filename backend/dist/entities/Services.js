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
exports.Services = void 0;
const typeorm_1 = require("typeorm");
const AppointmentServices_1 = require("./AppointmentServices");
let Services = class Services {
    id;
    name;
    description;
    price;
    isActive;
    createdAt;
    appointmentServices;
};
exports.Services = Services;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Services.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 255 }),
    __metadata("design:type", String)
], Services.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'description', nullable: true }),
    __metadata("design:type", Object)
], Services.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { name: 'price', precision: 12, scale: 2 }),
    __metadata("design:type", String)
], Services.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', {
        name: 'is_active',
        nullable: true,
        default: '1',
    }),
    __metadata("design:type", Object)
], Services.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Services.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AppointmentServices_1.AppointmentServices, (appointmentServices) => appointmentServices.service),
    __metadata("design:type", Array)
], Services.prototype, "appointmentServices", void 0);
exports.Services = Services = __decorate([
    (0, typeorm_1.Entity)('services', { schema: 'clinic_flow_erp' })
], Services);
//# sourceMappingURL=Services.js.map