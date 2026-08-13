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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentServicesController = void 0;
const common_1 = require("@nestjs/common");
const appointment_services_service_1 = require("./appointment-services.service");
const create_appointment_service_dto_1 = require("./dto/create-appointment-service.dto");
const update_appointment_service_dto_1 = require("./dto/update-appointment-service.dto");
let AppointmentServicesController = class AppointmentServicesController {
    appointmentServicesService;
    constructor(appointmentServicesService) {
        this.appointmentServicesService = appointmentServicesService;
    }
    create(createAppointmentServiceDto) {
        return this.appointmentServicesService.create(createAppointmentServiceDto);
    }
    findAll() {
        return this.appointmentServicesService.findAll();
    }
    findByAppointment(appointmentId) {
        return this.appointmentServicesService.findByAppointment(+appointmentId);
    }
    update(id, updateAppointmentServiceDto) {
        return this.appointmentServicesService.update(+id, updateAppointmentServiceDto);
    }
    remove(id) {
        return this.appointmentServicesService.remove(+id);
    }
};
exports.AppointmentServicesController = AppointmentServicesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_service_dto_1.CreateAppointmentServiceDto]),
    __metadata("design:returntype", void 0)
], AppointmentServicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppointmentServicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('appointment/:appointmentId'),
    __param(0, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentServicesController.prototype, "findByAppointment", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appointment_service_dto_1.UpdateAppointmentServiceDto]),
    __metadata("design:returntype", void 0)
], AppointmentServicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentServicesController.prototype, "remove", null);
exports.AppointmentServicesController = AppointmentServicesController = __decorate([
    (0, common_1.Controller)('appointment-services'),
    __metadata("design:paramtypes", [appointment_services_service_1.AppointmentServicesService])
], AppointmentServicesController);
//# sourceMappingURL=appointment-services.controller.js.map