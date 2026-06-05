import { Module } from '@nestjs/common';
import { DoctorProfilesService } from './doctor-profiles.service';
import { DoctorProfilesController } from './doctor-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorProfiles  } from '../entities/DoctorProfiles';
@Module({
  imports: [TypeOrmModule.forFeature([DoctorProfiles])],
  controllers: [DoctorProfilesController],
  providers: [DoctorProfilesService],
})
export class DoctorProfilesModule {}
