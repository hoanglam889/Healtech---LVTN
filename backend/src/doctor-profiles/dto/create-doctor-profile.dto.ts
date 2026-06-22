import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorProfileDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  specialtyId: number;

  @ApiProperty({ example: 'BS. Nguyễn Văn B' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  experienceYears?: number;

  @ApiPropertyOptional({ example: '/public/images/doctor.jpg' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
