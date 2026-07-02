import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ratings } from '../entities/Ratings';
import { Appointments } from '../entities/Appointments';
import { DoctorProfiles } from '../entities/DoctorProfiles';

@Module({
  imports: [TypeOrmModule.forFeature([Ratings, Appointments, DoctorProfiles])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
