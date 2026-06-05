import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorProfilesService } from './doctor-profiles.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Controller('doctor-profiles')
export class DoctorProfilesController {
  constructor(private readonly doctorProfilesService: DoctorProfilesService) {}

  @Post()
  create(@Body() createDoctorProfileDto: CreateDoctorProfileDto) {
    return this.doctorProfilesService.create(createDoctorProfileDto);
  }

  @Get()
  findAll() {
    return this.doctorProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorProfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorProfileDto: UpdateDoctorProfileDto) {
    return this.doctorProfilesService.update(+id, updateDoctorProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorProfilesService.remove(+id);
  }
}
