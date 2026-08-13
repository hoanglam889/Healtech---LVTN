import { AuthService } from './auth.service';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    staffLogin(body: any, res: Response): Promise<{
        success: boolean;
        user: {
            id: number;
            email: string | null;
            role: string;
            fullName: string;
            doctorProfileId: number | null;
            avatarUrl: string | null;
        };
    }>;
    patientLogin(body: any, res: Response): Promise<{
        success: boolean;
        user: {
            id: number;
            email: string | null;
            role: string;
            fullName: string;
        };
    }>;
    patientRegister(body: any, res: Response): Promise<{
        success: boolean;
        message: string;
        requireOtp?: undefined;
        email?: undefined;
    } | {
        success: boolean;
        requireOtp: boolean;
        email: string;
        message: string;
    }>;
    patientVerifyOtp(body: any, res: Response): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        user: {
            id: number;
            email: string | null;
            role: string;
            fullName: string;
        };
        message?: undefined;
    }>;
    updatePatientAccount(req: any, body: any): Promise<{
        success: boolean;
        message: string;
        user: {
            id: number;
            email: string | null;
            phone: string | null;
        };
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyResetOtp(body: {
        email: string;
        otpCode: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(body: {
        email: string;
        otpCode: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
