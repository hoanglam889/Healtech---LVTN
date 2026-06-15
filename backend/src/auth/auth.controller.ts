import { Controller, Post, Patch, Body, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('staff-login')
  async staffLogin(@Body() body: { phone: string; password: string }) {
    const { phone, password } = body;
    if (!phone || !password) throw new BadRequestException('Vui lòng điền số điện thoại và mật khẩu!');
    return this.authService.staffLogin(phone, password);
  }

  @Post('patient-login')
  async patientLogin(@Body() body: { phone: string; password: string }) {
    const { phone, password } = body;
    if (!phone || !password) throw new BadRequestException('Vui lòng điền số điện thoại và mật khẩu!');
    return this.authService.patientLogin(phone, password);
  }

  @Post('patient-register')
  async patientRegister(@Body() body: { phone: string; password: string; fullName: string; dob?: string; gender?: 'MALE' | 'FEMALE' }) {
    const { phone, password, fullName, dob, gender } = body;
    if (!phone || !password || !fullName) throw new BadRequestException('Họ tên, số điện thoại và mật khẩu là bắt buộc!');
    return this.authService.patientRegister(phone, password, fullName, dob, gender);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) throw new BadRequestException('Vui lòng điền đầy đủ mật khẩu!');
    if (newPassword.length < 1) throw new BadRequestException('Mật khẩu mới không hợp lệ!');
    return this.authService.changePassword(req.user.userId, req.user.role, oldPassword, newPassword);
  }
}
