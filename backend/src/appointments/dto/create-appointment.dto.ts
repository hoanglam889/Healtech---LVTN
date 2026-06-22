import { IsInt, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsInt()
  @Type(() => Number)
  patientId: number;

  @IsInt()
  @Type(() => Number)
  doctorProfileId: number;

  @IsDateString()
  appointmentDate: string;

  @IsString()
  appointmentTime: string;

  @IsEnum(['CASH', 'VNPAY'])
  paymentMethod: 'CASH' | 'VNPAY';

  @IsOptional()
  @IsEnum(['ONLINE', 'OFFLINE'])
  bookingType?: 'ONLINE' | 'OFFLINE';

  @IsOptional()
  @IsEnum(['BOOKED', 'WAITING'])
  initialStatus?: 'BOOKED' | 'WAITING';
}
