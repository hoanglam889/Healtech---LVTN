import { Controller, Post, Body, BadRequestException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type {Response} from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('staff-login')
  async staffLogin(@Body() body: any, @Res({passthrough: true }) res: Response) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Vui lòng điền email và mật khẩu!');
    }
    const loginData = await this.authService.staffLogin(email, password);

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
  async patientLogin(@Body() body: any, @Res({passthrough: true }) res: Response) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Vui lòng điền email và mật khẩu!');
    }
    const loginData = await this.authService.patientLogin(email, password);
    res.cookie('acces_token', loginData.access_token, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 60 * 1000,
    });
    const { access_token, ...userData} = loginData;
    return userData;
  }

  @Post('patient-register')
  async patientRegister(@Body() body: any, @Res({passthrough: true }) res: Response) {
    const { email, password, fullName, dob, gender } = body;
    if (!email || !password || !fullName) {
      throw new BadRequestException('Họ tên, email và mật khẩu là bắt buộc!');
    }
    const regData = await this.authService.patientRegister(email, password, fullName, dob, gender);
    // Không set cookie ở đây nữa vì người dùng chưa xác thực OTP
    return regData;
  }

  @Post('patient-verify-otp')
  async patientVerifyOtp(@Body() body: any, @Res({passthrough: true }) res: Response) {
    const { email, otpCode } = body;
    if (!email || !otpCode) {
      throw new BadRequestException('Email và mã OTP là bắt buộc!');
    }
    const verifyData = await this.authService.patientVerifyOtp(email, otpCode);
    if (verifyData.success) {
      res.cookie('acces_token', verifyData.access_token, {
        httpOnly: true,
        secure: false,
        maxAge: 5 * 60 * 60 * 1000,
      });
      const { access_token, ...userData} = verifyData;
      return userData;
    }
    return verifyData;
  }
}
