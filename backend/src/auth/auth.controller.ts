import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('staff-login')
  async staffLogin(@Body() body: any) {
    const { phone, password } = body;
    if (!phone || !password) {
      throw new BadRequestException('Vui lòng điền số điện thoại và mật khẩu!');
    }
    return this.authService.staffLogin(phone, password);
  }

  @Post('patient-login')
  async patientLogin(@Body() body: any) {
    const { phone, password } = body;
    if (!phone || !password) {
      throw new BadRequestException('Vui lòng điền số điện thoại và mật khẩu!');
    }
    return this.authService.patientLogin(phone, password);
  }

  @Post('patient-register')
  async patientRegister(@Body() body: any) {
    const { phone, password, fullName, dob, gender } = body;
    if (!phone || !password || !fullName) {
      throw new BadRequestException('Họ tên, số điện thoại và mật khẩu là bắt buộc!');
    }
    return this.authService.patientRegister(phone, password, fullName, dob, gender);
  }
}
