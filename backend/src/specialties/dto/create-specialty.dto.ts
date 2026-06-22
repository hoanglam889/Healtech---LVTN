import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Tim mạch' })
  name: string;

  @ApiPropertyOptional({ example: 'heart' })
  icon?: string;

  @ApiPropertyOptional({ example: 'Chuyên khoa tim mạch' })
  description?: string;
}
