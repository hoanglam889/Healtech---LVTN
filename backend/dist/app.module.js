"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const specialties_module_1 = require("./specialties/specialties.module");
const upload_module_1 = require("./upload/upload.module");
const doctor_profiles_module_1 = require("./doctor-profiles/doctor-profiles.module");
const patients_module_1 = require("./patients/patients.module");
const appointments_module_1 = require("./appointments/appointments.module");
const auth_module_1 = require("./auth/auth.module");
const admin_module_1 = require("./admin/admin.module");
const mailer_1 = require("@nestjs-modules/mailer");
const services_module_1 = require("./services/services.module");
const appointment_services_module_1 = require("./appointment-services/appointment-services.module");
const invoices_module_1 = require("./invoices/invoices.module");
const payments_module_1 = require("./payments/payments.module");
const events_module_1 = require("./events/events.module");
const ai_module_1 = require("./ai/ai.module");
const articles_module_1 = require("./articles/articles.module");
const ratings_module_1 = require("./ratings/ratings.module");
const mail_module_1 = require("./mail/mail.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '3306', 10),
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_DATABASE,
                entities: [
                    __dirname + '/**/*.entity{.ts,.js}',
                    __dirname + '/entities/*{.ts,.js}',
                ],
                synchronize: false,
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'lamphan3107@gmail.com',
                        pass: 'vqla yjkd hdlf wytk',
                    },
                },
                defaults: {
                    from: '"Phòng khám Healtech" <lamphan3107@gmail.com>',
                },
            }),
            specialties_module_1.SpecialtiesModule,
            upload_module_1.UploadModule,
            doctor_profiles_module_1.DoctorProfilesModule,
            patients_module_1.PatientsModule,
            appointments_module_1.AppointmentsModule,
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            services_module_1.ServicesModule,
            appointment_services_module_1.AppointmentServicesModule,
            invoices_module_1.InvoicesModule,
            payments_module_1.PaymentsModule,
            events_module_1.EventsModule,
            ai_module_1.AiModule,
            articles_module_1.ArticlesModule,
            ratings_module_1.RatingsModule,
            mail_module_1.MailModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map