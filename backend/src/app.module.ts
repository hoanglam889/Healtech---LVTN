import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpecialtiesModule } from './specialties/specialties.module';
import { UploadModule } from './upload/upload.module';
import { DoctorProfilesModule } from './doctor-profiles/doctor-profiles.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    // 1. Load file cấu hình .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Cấu hình kết nối MySQL thông qua TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE, 
      entities: [__dirname + '/**/*.entity{.ts,.js}', __dirname + '/entities/*{.ts,.js}'],
      synchronize: false, // Tự động đồng bộ các Entity (Model) vào DB - Rất tiện khi phát triển
    }),
    SpecialtiesModule,
    UploadModule,
    DoctorProfilesModule,
    PatientsModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
