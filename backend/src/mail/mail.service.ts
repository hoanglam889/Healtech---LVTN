import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  // 1. Hàm gửi mail Xác thực đăng ký bằng OTP
  async sendRegisterOTP(email: string, otpCode: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Mã xác thực Đăng ký Healtech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="background-color: #2563eb; padding: 16px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">HEALTECH CLINIC</h2>
          </div>
          <div style="padding: 24px;">
            <h3 style="color: #1f2937;">Xác thực tài khoản</h3>
            <p style="color: #4b5563;">Mã OTP của bạn là:</p>
            <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #2563eb; border-radius: 6px; margin: 16px 0;">
              ${otpCode}
            </div>
            <p style="color: #6b7280; font-size: 13px;">Vui lòng nhập mã này trên ứng dụng. Mã sẽ hết hạn sau 5 phút.</p>
          </div>
        </div>
      `,
    });
  }

  // 2. Hàm gửi mail Đặt khám thành công
  async sendBookingSuccess(email: string, qrCode: string, date: string, time: string, accountName: string, patientName: string) {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCode}`;
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác nhận Đặt lịch khám thành công - Healtech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #10b981; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">ĐẶT LỊCH THÀNH CÔNG</h2>
          </div>
          <div style="padding: 24px;">
            <p style="color: #374151; font-size: 16px;">Xin chào <b>${accountName}</b>,</p>
            <p style="color: #4b5563;">Cảm ơn bạn đã đặt lịch khám tại Phòng khám Healtech cho bệnh nhân <b>${patientName}</b>. Dưới đây là thông tin lịch khám:</p>
            
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Ngày khám:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: bold; text-align: right;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Giờ dự kiến:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: bold; text-align: right;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Mã phiếu khám:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #10b981; font-weight: bold; text-align: right;">${qrCode}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
              <p style="color: #4b5563; font-size: 14px; margin-top: 0; font-weight: bold;">Vui lòng đưa mã QR này cho Lễ tân khi đến khám:</p>
              <img src="${qrImageUrl}" alt="QR Code" style="width: 200px; height: 200px; border: 4px solid white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">Vui lòng đến trước 15 phút để làm thủ tục. Xin cảm ơn!</p>
          </div>
        </div>
      `,
    });
  }

  // 3. Hàm gửi mail Nhắc tới lượt
  async sendTurnReminder(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Sắp tới lượt khám của bạn!',
      html: `<p>Vui lòng di chuyển đến cửa phòng khám để không bị mất lượt khám.</p>`,
    });
  }
}
