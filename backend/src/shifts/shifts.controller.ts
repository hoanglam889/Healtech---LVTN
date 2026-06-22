import { Controller, Get } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('shifts')
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  findAll() {
    return this.shiftsService.findAll();
  }
}
