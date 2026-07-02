import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('contact')
  async sendContact(
    @Body() body: { name: string; phone: string; email: string; message: string },
  ) {
    const { name, phone, email, message } = body;
    if (!name || !phone || !email || !message) {
      throw new BadRequestException('Vui lòng điền đầy đủ thông tin liên hệ!');
    }

    try {
      await this.mailService.sendContactMail(name, phone, email, message);
      return { success: true, message: 'Gửi liên hệ thành công!' };
    } catch (error) {
      console.error('Lỗi gửi mail liên hệ:', error);
      throw new BadRequestException(`Lỗi gửi mail: ${error.message || error}`);
    }
  }
}
