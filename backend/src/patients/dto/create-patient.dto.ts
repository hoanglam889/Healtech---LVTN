import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

const msg = (key: string) => i18nValidationMessage(key);

export class CreatePatientDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt({ message: msg('validation.isInt') })
  @Type(() => Number)
  patientAccountId?: number;

  @ApiPropertyOptional({ example: 'Bản thân' })
  @IsOptional()
  @IsString({ message: msg('validation.isString') })
  relationship?: string;

  @ApiPropertyOptional({ example: '012345678901' })
  @IsOptional()
  @IsString({ message: msg('validation.isString') })
  cccd?: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString({ message: msg('validation.isString') })
  fullName: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsString({ message: msg('validation.isString') })
  dob: string;

  @ApiProperty({ enum: ['MALE', 'FEMALE', 'OTHER'] })
  @IsEnum(['MALE', 'FEMALE', 'OTHER'], { message: msg('validation.isEnum') })
  gender: 'MALE' | 'FEMALE' | 'OTHER';

  @ApiPropertyOptional({ example: '0797551612' })
  @IsOptional()
  @IsString({ message: msg('validation.isString') })
  phone?: string;

  @ApiPropertyOptional({ example: '123 Đường ABC, TP.HCM' })
  @IsOptional()
  @IsString({ message: msg('validation.isString') })
  address?: string;
}
