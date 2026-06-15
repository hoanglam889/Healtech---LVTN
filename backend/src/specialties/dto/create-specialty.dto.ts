import { IsString, IsOptional } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
