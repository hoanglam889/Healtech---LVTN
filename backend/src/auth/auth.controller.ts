import { Controller, Post, Body, BadRequestException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type {Response} from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('staff-login')
  async staffLogin(@Body() body: any, @Res({passthrough: true }) res: Response) {
    const { phone, password } = body;
    if (!phone || !password) {
      throw new BadRequestException('Vui lòng điền số điện thoại và mật khẩu!');
    }
    const loginData = await this.authService.staffLogin(phone, password);

    //gắn token
    res.cookie('acces_token', loginData.access_token, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 60 * 1000, // 5 tiếng
    });
    const { access_token, ...userData} = loginData;
    return userData;
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
