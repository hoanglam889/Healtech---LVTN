import { Controller, Get, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('details/:appointmentId')
  getInvoiceDetails(@Param('appointmentId') appointmentId: string) {
    return this.invoicesService.getInvoiceDetails(+appointmentId);
  }
}
