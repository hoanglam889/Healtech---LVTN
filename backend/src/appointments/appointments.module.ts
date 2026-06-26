import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from '../entities/Appointments';
import { Invoices } from '../entities/Invoices';
import { AppointmentStatusLogs } from '../entities/AppointmentStatusLogs';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, Invoices, AppointmentStatusLogs]), MailModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
