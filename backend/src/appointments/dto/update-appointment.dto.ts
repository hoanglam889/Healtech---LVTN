import { IsOptional, IsEnum } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsEnum(['BOOKED', 'WAITING', 'EXAMINING', 'DONE', 'CANCELLED'])
  status?: 'BOOKED' | 'WAITING' | 'EXAMINING' | 'DONE' | 'CANCELLED';
}
