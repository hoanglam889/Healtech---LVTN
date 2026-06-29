import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-url')
  async createPaymentUrl(
    @Body('invoiceId') invoiceId: string,
    @Body('amount') amount: number,
    @Body('source') source?: string,
  ) {
    if (!invoiceId) {
      throw new BadRequestException('Mã hóa đơn không được để trống');
    }
    const url = await this.paymentsService.createPaymentUrl(invoiceId, amount, source);
    return { url };
  }

  @Get('vnpay-return')
  async vnpayReturn(@Query() query: any, @Res() res: any) {
    const source = query.source || 'reception';
    const result = await this.paymentsService.vnpayReturn(query as any);
    // Redirect về Frontend hiển thị kết quả
    const frontendUrl = `http://localhost:5173/payment-result?status=${result.status}&invoiceId=${result.invoiceId}&amount=${result.amount}&message=${encodeURIComponent(result.message)}&source=${source}`;
    return res.redirect(frontendUrl);
  }
}
