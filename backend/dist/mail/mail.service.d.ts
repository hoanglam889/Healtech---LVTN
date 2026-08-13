import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendRegisterOTP(email: string, otpCode: string): Promise<void>;
    sendForgotPasswordOTP(email: string, otpCode: string): Promise<void>;
    sendBookingSuccess(email: string, qrCode: string, date: string, time: string, accountName: string, patientName: string): Promise<void>;
    sendTurnReminder(email: string): Promise<void>;
    sendContactMail(name: string, phone: string, email: string, message: string): Promise<void>;
}
