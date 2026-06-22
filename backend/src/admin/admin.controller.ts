import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard-stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('schedules')
  getSchedules() {
    return this.adminService.getSchedules();
  }

  @Post('schedules')
  createSchedule(@Body() dto: { doctorProfileId: number; shiftId: number; date: string; maxPatients?: number }) {
    return this.adminService.createSchedule(dto);
  }

  @Delete('schedules/:id')
  deleteSchedule(@Param('id') id: string) {
    return this.adminService.deleteSchedule(+id);
  }

  @Get('shifts')
  getShifts() {
    return this.adminService.getShifts();
  }
}
