import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  patientAccountId?: number;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  cccd?: string;

  @IsString()
  fullName: string;

  @IsString()
  dob: string;

  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender: 'MALE' | 'FEMALE' | 'OTHER';

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
