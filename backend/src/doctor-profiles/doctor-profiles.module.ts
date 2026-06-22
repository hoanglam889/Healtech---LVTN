import { Module } from '@nestjs/common';
import { DoctorProfilesService } from './doctor-profiles.service';
import { DoctorProfilesController } from './doctor-profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { Users } from '../entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorProfiles, Users])],
  controllers: [DoctorProfilesController],
  providers: [DoctorProfilesService],
})
export class DoctorProfilesModule {}
