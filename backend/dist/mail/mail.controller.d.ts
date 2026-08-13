import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    sendContact(body: {
        name: string;
        phone: string;
        email: string;
        message: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
