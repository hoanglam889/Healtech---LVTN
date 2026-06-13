import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from '../entities/Users';
import { PatientAccounts } from '../entities/PatientAccounts';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { Patients } from '../entities/Patients';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, PatientAccounts, DoctorProfiles, Patients]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
