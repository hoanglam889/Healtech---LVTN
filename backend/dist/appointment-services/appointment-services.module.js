"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentServicesModule = void 0;
const common_1 = require("@nestjs/common");
const appointment_services_service_1 = require("./appointment-services.service");
const appointment_services_controller_1 = require("./appointment-services.controller");
const typeorm_1 = require("@nestjs/typeorm");
const AppointmentServices_1 = require("../entities/AppointmentServices");
const Appointments_1 = require("../entities/Appointments");
let AppointmentServicesModule = class AppointmentServicesModule {
};
exports.AppointmentServicesModule = AppointmentServicesModule;
exports.AppointmentServicesModule = AppointmentServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([AppointmentServices_1.AppointmentServices, Appointments_1.Appointments])],
        controllers: [appointment_services_controller_1.AppointmentServicesController],
        providers: [appointment_services_service_1.AppointmentServicesService],
    })
], AppointmentServicesModule);
//# sourceMappingURL=appointment-services.module.js.map