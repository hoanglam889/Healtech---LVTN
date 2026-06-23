import { IsInt, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

const msg = (key: string) => i18nValidationMessage(key);

export class CreateAppointmentDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: msg('validation.isInt') })
  @Type(() => Number)
  patientId: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: msg('validation.isInt') })
  @Type(() => Number)
  doctorProfileId: number;

  @ApiProperty({ example: '2024-06-22' })
  @IsDateString({}, { message: msg('validation.isDateString') })
  appointmentDate: string;

  @ApiProperty({ example: '09:00' })
  @IsString({ message: msg('validation.isString') })
  appointmentTime: string;

  @ApiProperty({ enum: ['CASH', 'VNPAY'] })
  @IsEnum(['CASH', 'VNPAY'], { message: msg('validation.isEnum') })
  paymentMethod: 'CASH' | 'VNPAY';

  @ApiPropertyOptional({ enum: ['ONLINE', 'OFFLINE'] })
  @IsOptional()
  @IsEnum(['ONLINE', 'OFFLINE'], { message: msg('validation.isEnum') })
  bookingType?: 'ONLINE' | 'OFFLINE';

  @ApiPropertyOptional({ enum: ['BOOKED', 'WAITING'] })
  @IsOptional()
  @IsEnum(['BOOKED', 'WAITING'], { message: msg('validation.isEnum') })
  initialStatus?: 'BOOKED' | 'WAITING';
}
