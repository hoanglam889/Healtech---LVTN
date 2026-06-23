import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

const msg = (key: string) => i18nValidationMessage(key);

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Tim mạch' })
  @IsString({ message: msg('validation.isString') })
  name: string;

  @ApiPropertyOptional({ example: 'heart' })
  @IsOptional()
  @IsString({ message: msg('validation.isString') })
  icon?: string;

  @ApiPropertyOptional({ example: 'Chuyên khoa tim mạch' })
  @IsOptional()
  @IsString({ message: msg('validation.isString') })
  description?: string;
}
