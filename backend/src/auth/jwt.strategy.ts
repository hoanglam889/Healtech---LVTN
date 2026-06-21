import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Chỉ định cách lấy Token: Lấy từ trong Cookie có tên là 'access_token'
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let data = request?.cookies['access_token']; 
          if (!data) {
             data = request?.cookies['acces_token']; // Đề phòng bạn gõ sai chính tả lúc set cookie
          }
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      ignoreExpiration: false, // Bắt buộc phải kiểm tra thời hạn (8 tiếng)
      // Chú ý: Phải giống y chang chuỗi secret bạn đã khai báo trong auth.module.ts
      secretOrKey: 'HEATH_TECH_SECRET_KEY', 
    });
  }

  // Hàm này tự động chạy nếu Token hợp lệ
  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    // Gắn thông tin id và role vào req.user để các Controller sau này xài
    return { id: payload.id, role: payload.role };
  }
}
