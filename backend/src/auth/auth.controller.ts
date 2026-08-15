import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('staff-login')
  async staffLogin(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Vui lòng điền email và mật khẩu!');
    }
    const loginData = await this.authService.staffLogin(email, password);

    //gắn token
    res.cookie('acces_token', loginData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 5 * 60 * 60 * 1000, // 5 tiếng
    });
    const { access_token, ...userData } = loginData;
    return userData;
  }

  @Public()
  @Post('patient-login')
  async patientLogin(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Vui lòng điền email và mật khẩu!');
    }
    const loginData = await this.authService.patientLogin(email, password);
    res.cookie('acces_token', loginData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 tháng
    });
    const { access_token, ...userData } = loginData;
    return userData;
  }

  @Public()
  @Post('patient-register')
  async patientRegister(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password, fullName, dob, gender } = body;
    if (!email || !password || !fullName) {
      throw new BadRequestException('Họ tên, email và mật khẩu là bắt buộc!');
    }
    const regData = await this.authService.patientRegister(
      email,
      password,
      fullName,
      dob,
      gender,
    );
    // Không set cookie ở đây nữa vì người dùng chưa xác thực OTP
    return regData;
  }

  @Public()
  @Post('patient-verify-otp')
  async patientVerifyOtp(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, otpCode } = body;
    if (!email || !otpCode) {
      throw new BadRequestException('Email và mã OTP là bắt buộc!');
    }
    const verifyData = await this.authService.patientVerifyOtp(email, otpCode);
    if (verifyData.success) {
      res.cookie('acces_token', verifyData.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 1 tháng
      });
      const { access_token, ...userData } = verifyData;
      return userData;
    }
    return verifyData;
  }

  @UseGuards(JwtAuthGuard)
  @Put('patient-account/update')
  async updatePatientAccount(@Req() req: any, @Body() body: any) {
    const userId = req.user.id;
    if (!userId || req.user.role !== 'PATIENT') {
      throw new BadRequestException('Bạn không có quyền thực hiện thao tác này');
    }
    
    return this.authService.updatePatientAccount(userId, body);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    if (!body.email) throw new BadRequestException('Vui lòng cung cấp email');
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('verify-reset-otp')
  async verifyResetOtp(@Body() body: { email: string; otpCode: string }) {
    if (!body.email || !body.otpCode) throw new BadRequestException('Thiếu thông tin xác thực');
    return this.authService.verifyResetOtp(body.email, body.otpCode);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; otpCode: string; newPassword: string }) {
    if (!body.email || !body.otpCode || !body.newPassword) {
      throw new BadRequestException('Thiếu thông tin đặt lại mật khẩu');
    }
    return this.authService.resetPassword(body.email, body.otpCode, body.newPassword);
  }
}
