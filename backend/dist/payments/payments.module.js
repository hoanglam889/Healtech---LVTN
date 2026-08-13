"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Invoices_1 = require("../entities/Invoices");
const Appointments_1 = require("../entities/Appointments");
const AppointmentStatusLogs_1 = require("../entities/AppointmentStatusLogs");
const nestjs_vnpay_1 = require("nestjs-vnpay");
const config_1 = require("@nestjs/config");
const vnpay_1 = require("vnpay");
const events_module_1 = require("../events/events.module");
const mail_module_1 = require("../mail/mail.module");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Invoices_1.Invoices, Appointments_1.Appointments, AppointmentStatusLogs_1.AppointmentStatusLogs]),
            events_module_1.EventsModule,
            mail_module_1.MailModule,
            nestjs_vnpay_1.VnpayModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    tmnCode: configService.get('VNP_TMN_CODE') || 'VNPAY',
                    secureSecret: configService.get('VNP_HASH_SECRET') || 'VNPAYSECRET',
                    vnpayHost: 'https://sandbox.vnpayment.vn',
                    testMode: true,
                    hashAlgorithm: vnpay_1.HashAlgorithm.SHA512,
                    enableLog: true,
                    loggerFn: vnpay_1.ignoreLogger,
                }),
            })
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map