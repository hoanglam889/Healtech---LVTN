import { Controller, Post, Patch, Body, BadRequestException, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('staff-login')
  async staffLogin(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { phone, password } = body;
    if (!phone || !password) {
      throw new BadRequestException({ i18nKey: 'errors.auth.missing_login_fields' });
    }
    const loginData = await this.authService.staffLogin(phone, password);
    res.cookie('acces_token', loginData.access_token, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 60 * 1000,
    });
    const { access_token, ...userData } = loginData;
    return userData;
  }

  @Post('patient-login')
  async patientLogin(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException({ i18nKey: 'errors.auth.missing_login_fields' });
    }
    const loginData = await this.authService.patientLogin(email, password);
    res.cookie('acces_token', loginData.access_token, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 60 * 1000,
    });
    const { access_token, ...userData } = loginData;
    return userData;
  }

  @Post('patient-register')
  async patientRegister(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { email, password, fullName, dob, gender } = body;
    if (!email || !password || !fullName) {
      throw new BadRequestException({ i18nKey: 'errors.auth.missing_register_fields' });
    }
    const regData = await this.authService.patientRegister(email, password, fullName, dob, gender);
    res.cookie('acces_token', regData.access_token, {
      httpOnly: true,
      secure: false,
      maxAge: 5 * 60 * 60 * 1000,
    });
    const { access_token, ...userData } = regData;
    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('change-password')
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) {
      throw new BadRequestException({ i18nKey: 'errors.auth.missing_password_fields' });
    }
    return this.authService.changePassword(req.user.id, req.user.role, oldPassword, newPassword);
  }
}
