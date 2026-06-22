import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  patientAccountId?: number;

  @ApiPropertyOptional({ example: 'Bản thân' })
  @IsOptional()
  @IsString()
  relationship?: string;

  @ApiPropertyOptional({ example: '012345678901' })
  @IsOptional()
  @IsString()
  cccd?: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsString()
  dob: string;

  @ApiProperty({ enum: ['MALE', 'FEMALE', 'OTHER'] })
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender: 'MALE' | 'FEMALE' | 'OTHER';

  @ApiPropertyOptional({ example: '0797551612' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Đường ABC, TP.HCM' })
  @IsOptional()
  @IsString()
  address?: string;
}
