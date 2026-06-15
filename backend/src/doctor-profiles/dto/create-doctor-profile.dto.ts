import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDoctorProfileDto {
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsInt()
  @Type(() => Number)
  specialtyId: number;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  experienceYears?: number;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
