import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Ném ra lỗi 401 nếu không có Cookie hoặc Token hết hạn
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn!',
        )
      );
    }
    return user;
  }
}
