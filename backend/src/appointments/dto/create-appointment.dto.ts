import { IsInt, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  patientId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  doctorProfileId: number;

  @ApiProperty({ example: '2024-06-22' })
  @IsDateString()
  appointmentDate: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  appointmentTime: string;

  @ApiProperty({ enum: ['CASH', 'VNPAY'] })
  @IsEnum(['CASH', 'VNPAY'])
  paymentMethod: 'CASH' | 'VNPAY';

  @ApiPropertyOptional({ enum: ['ONLINE', 'OFFLINE'] })
  @IsOptional()
  @IsEnum(['ONLINE', 'OFFLINE'])
  bookingType?: 'ONLINE' | 'OFFLINE';

  @ApiPropertyOptional({ enum: ['BOOKED', 'WAITING'] })
  @IsOptional()
  @IsEnum(['BOOKED', 'WAITING'])
  initialStatus?: 'BOOKED' | 'WAITING';
}
