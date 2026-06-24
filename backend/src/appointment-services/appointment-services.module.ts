import { Module } from '@nestjs/common';
import { AppointmentServicesService } from './appointment-services.service';
import { AppointmentServicesController } from './appointment-services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentServices } from '../entities/AppointmentServices';
import { Appointments } from '../entities/Appointments';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentServices, Appointments])],
  controllers: [AppointmentServicesController],
  providers: [AppointmentServicesService],
})
export class AppointmentServicesModule {}
