import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DoctorSchedulesService, CreateDoctorScheduleDto } from './doctor-schedules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doctor-schedules')
export class DoctorSchedulesController {
  constructor(private readonly doctorSchedulesService: DoctorSchedulesService) {}

  @Get()
  findAll(@Query('doctorProfileId') doctorProfileId?: string) {
    return this.doctorSchedulesService.findAll(doctorProfileId ? +doctorProfileId : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateDoctorScheduleDto) {
    return this.doctorSchedulesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorSchedulesService.remove(+id);
  }
}
