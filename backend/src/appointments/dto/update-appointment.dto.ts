import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ enum: ['BOOKED', 'WAITING', 'EXAMINING', 'DONE', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['BOOKED', 'WAITING', 'EXAMINING', 'DONE', 'CANCELLED'])
  status?: 'BOOKED' | 'WAITING' | 'EXAMINING' | 'DONE' | 'CANCELLED';
}
