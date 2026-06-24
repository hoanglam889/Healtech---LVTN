import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoices } from '../entities/Invoices';
import { AppointmentServices } from '../entities/AppointmentServices';
import { Services } from '../entities/Services';

@Module({
  imports: [TypeOrmModule.forFeature([Invoices, AppointmentServices, Services])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
