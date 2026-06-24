import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentServicesService } from './appointment-services.service';
import { CreateAppointmentServiceDto } from './dto/create-appointment-service.dto';
import { UpdateAppointmentServiceDto } from './dto/update-appointment-service.dto';

@Controller('appointment-services')
export class AppointmentServicesController {
  constructor(private readonly appointmentServicesService: AppointmentServicesService) {}

  @Post()
  create(@Body() createAppointmentServiceDto: CreateAppointmentServiceDto) {
    return this.appointmentServicesService.create(createAppointmentServiceDto);
  }

  @Get()
  findAll() {
    return this.appointmentServicesService.findAll();
  }

  @Get('appointment/:appointmentId')
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.appointmentServicesService.findByAppointment(+appointmentId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentServiceDto: UpdateAppointmentServiceDto) {
    return this.appointmentServicesService.update(+id, updateAppointmentServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentServicesService.remove(+id);
  }
}
