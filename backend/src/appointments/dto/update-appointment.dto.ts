import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ enum: ['BOOKED', 'WAITING', 'EXAMINING', 'DONE', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['BOOKED', 'WAITING', 'EXAMINING', 'DONE', 'CANCELLED'], {
    message: i18nValidationMessage('validation.isEnum'),
  })
  status?: 'BOOKED' | 'WAITING' | 'EXAMINING' | 'DONE' | 'CANCELLED';
}
