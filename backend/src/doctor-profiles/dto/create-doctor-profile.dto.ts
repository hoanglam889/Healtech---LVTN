import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

const msg = (key: string) => i18nValidationMessage(key);

export class CreateDoctorProfileDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: msg('validation.isInt') })
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: msg('validation.isInt') })
  @Type(() => Number)
  specialtyId: number;

  @ApiProperty({ example: 'BS. Nguyễn Văn B' })
  @IsString({ message: msg('validation.isString') })
  fullName: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt({ message: msg('validation.isInt') })
  @Type(() => Number)
  experienceYears?: number;

  @ApiPropertyOptional({ example: '/public/images/doctor.jpg' })
  @IsOptional()
  @IsString({ message: msg('validation.isString') })
  avatarUrl?: string;
}
