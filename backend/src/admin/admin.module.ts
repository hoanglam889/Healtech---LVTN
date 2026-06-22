import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { Patients } from '../entities/Patients';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { DoctorSchedules } from '../entities/DoctorSchedules';
import { Users } from '../entities/Users';
import { Shifts } from '../entities/Shifts';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointments,
      Invoices,
      Patients,
      DoctorProfiles,
      DoctorSchedules,
      Users,
      Shifts,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
