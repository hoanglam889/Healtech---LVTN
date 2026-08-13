"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const Appointments_1 = require("../entities/Appointments");
const Invoices_1 = require("../entities/Invoices");
const Patients_1 = require("../entities/Patients");
const DoctorProfiles_1 = require("../entities/DoctorProfiles");
const DoctorSchedules_1 = require("../entities/DoctorSchedules");
const Users_1 = require("../entities/Users");
const Shifts_1 = require("../entities/Shifts");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Appointments_1.Appointments,
                Invoices_1.Invoices,
                Patients_1.Patients,
                DoctorProfiles_1.DoctorProfiles,
                DoctorSchedules_1.DoctorSchedules,
                Users_1.Users,
                Shifts_1.Shifts,
            ]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map