import { IsInt, IsString, IsEnum, IsDateString } from 'class-validator';
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
}
