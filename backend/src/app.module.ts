import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, AcceptLanguageResolver, QueryResolver, I18nValidationPipe } from 'nestjs-i18n';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpecialtiesModule } from './specialties/specialties.module';
import { UploadModule } from './upload/upload.module';
import { DoctorProfilesModule } from './doctor-profiles/doctor-profiles.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ShiftsModule } from './shifts/shifts.module';
import { DoctorSchedulesModule } from './doctor-schedules/doctor-schedules.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}', __dirname + '/entities/*{.ts,.js}'],
      synchronize: false,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    SpecialtiesModule,
    UploadModule,
    DoctorProfilesModule,
    PatientsModule,
    AppointmentsModule,
    AuthModule,
    AdminModule,
    ShiftsModule,
    DoctorSchedulesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    {
      provide: APP_PIPE,
      useFactory: () => new I18nValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
