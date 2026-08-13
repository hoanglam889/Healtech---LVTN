import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { PatientAccounts } from '../entities/PatientAccounts';
import { DoctorProfiles } from '../entities/DoctorProfiles';
import { Patients } from '../entities/Patients';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly usersRepo;
    private readonly patientAccountsRepo;
    private readonly doctorProfilesRepo;
    private readonly patientsRepo;
    private readonly jwtService;
    private readonly mailService;
    constructor(usersRepo: Repository<Users>, patientAccountsRepo: Repository<PatientAccounts>, doctorProfilesRepo: Repository<DoctorProfiles>, patientsRepo: Repository<Patients>, jwtService: JwtService, mailService: MailService);
    staffLogin(email: string, pass: string): Promise<{
        success: boolean;
        access_token: string;
        user: {
            id: number;
            email: string | null;
            role: string;
            fullName: string;
            doctorProfileId: number | null;
            avatarUrl: string | null;
        };
    }>;
    patientLogin(email: string, pass: string): Promise<{
        success: boolean;
        access_token: string;
        user: {
            id: number;
            email: string | null;
            role: string;
            fullName: string;
        };
    }>;
    patientRegister(email: string, pass: string, name: string, dob?: string, gender?: 'MALE' | 'FEMALE'): Promise<{
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
    patientVerifyOtp(email: string, otpCode: string): Promise<{
        success: boolean;
        message: string;
        access_token?: undefined;
        user?: undefined;
    } | {
        success: boolean;
        access_token: string;
        user: {
            id: number;
            email: string | null;
            role: string;
            fullName: string;
        };
        message?: undefined;
    }>;
    updatePatientAccount(accountId: number, updateDto: {
        email?: string;
        oldPassword?: string;
        newPassword?: string;
    }): Promise<{
        success: boolean;
        message: string;
        user: {
            id: number;
            email: string | null;
            phone: string | null;
        };
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyResetOtp(email: string, otpCode: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(email: string, otpCode: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
