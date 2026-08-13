"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Users_1 = require("../entities/Users");
const PatientAccounts_1 = require("../entities/PatientAccounts");
const DoctorProfiles_1 = require("../entities/DoctorProfiles");
const Patients_1 = require("../entities/Patients");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    usersRepo;
    patientAccountsRepo;
    doctorProfilesRepo;
    patientsRepo;
    jwtService;
    mailService;
    constructor(usersRepo, patientAccountsRepo, doctorProfilesRepo, patientsRepo, jwtService, mailService) {
        this.usersRepo = usersRepo;
        this.patientAccountsRepo = patientAccountsRepo;
        this.doctorProfilesRepo = doctorProfilesRepo;
        this.patientsRepo = patientsRepo;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async staffLogin(email, pass) {
        const user = await this.usersRepo.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác!');
        }
        const isMatch = user.passwordHash.startsWith('$2')
            ? await bcrypt.compare(pass, user.passwordHash)
            : user.passwordHash === pass;
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác!');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt!');
        }
        const normalizedRole = user.role ? user.role.toString().toUpperCase() : '';
        let fullName = 'Nhân viên lễ tân';
        if (normalizedRole === 'ADMIN') {
            fullName = 'Quản trị viên';
        }
        let doctorProfileId = null;
        let avatarUrl = null;
        if (normalizedRole === 'DOCTOR') {
            const docProfile = await this.doctorProfilesRepo.findOne({
                where: { userId: user.id },
            });
            if (docProfile) {
                fullName = docProfile.fullName;
                doctorProfileId = docProfile.id;
                avatarUrl = docProfile.avatarUrl;
            }
            else {
                fullName = 'Bác sĩ trực ban';
            }
        }
        const payload = { id: user.id, role: normalizedRole };
        const access_token = this.jwtService.sign(payload);
        return {
            success: true,
            access_token,
            user: {
                id: user.id,
                email: user.email,
                role: normalizedRole,
                fullName,
                doctorProfileId,
                avatarUrl,
            },
        };
    }
    async patientLogin(email, pass) {
        const account = await this.patientAccountsRepo.findOne({
            where: { email },
            relations: { patients: true },
        });
        if (!account) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác!');
        }
        const isMatch = account.passwordHash.startsWith('$2')
            ? await bcrypt.compare(pass, account.passwordHash)
            : account.passwordHash === pass;
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác!');
        }
        if (account.isActive == false) {
            throw new common_1.UnauthorizedException('Tài khoản chưa được kích hoạt! Vui lòng xác thực mã để tiếp tục.');
        }
        let fullName = 'Bệnh nhân';
        const mainPatient = account.patients?.find((p) => p.relationship === 'Bản thân' || p.relationship === 'SELF') || account.patients?.[0];
        if (mainPatient) {
            fullName = mainPatient.fullName;
        }
        const payload = { id: account.id, role: 'PATIENT' };
        const access_token = this.jwtService.sign(payload);
        return {
            success: true,
            access_token,
            user: {
                id: account.id,
                email: account.email,
                role: 'PATIENT',
                fullName,
            },
        };
    }
    async patientRegister(email, pass, name, dob, gender) {
        const existing = await this.patientAccountsRepo.findOne({
            where: { email },
        });
        if (existing) {
            if (existing.isActive) {
                return {
                    success: false,
                    message: 'Email này đã được đăng ký tài khoản!',
                };
            }
            else {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                existing.otpCode = otp;
                existing.passwordHash = pass;
                await this.patientAccountsRepo.save(existing);
                this.mailService
                    .sendRegisterOTP(email, otp)
                    .catch((e) => console.error(e));
                return {
                    success: true,
                    requireOtp: true,
                    email: email,
                    message: 'Mã xác thực mới đã được gửi đến email của bạn.',
                };
            }
        }
        const newAccount = new PatientAccounts_1.PatientAccounts();
        newAccount.email = email;
        newAccount.passwordHash = await bcrypt.hash(pass, 10);
        newAccount.isActive = false;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newAccount.otpCode = otp;
        const savedAccount = await this.patientAccountsRepo.save(newAccount);
        const newPatient = new Patients_1.Patients();
        newPatient.patientAccountId = savedAccount.id;
        newPatient.fullName = name;
        newPatient.dob = dob || '1995-01-01';
        newPatient.gender = gender || 'MALE';
        newPatient.relationship = 'Bản thân';
        await this.patientsRepo.save(newPatient);
        this.mailService.sendRegisterOTP(email, otp).catch((e) => console.error(e));
        return {
            success: true,
            requireOtp: true,
            email: email,
            message: 'Vui lòng kiểm tra email để lấy mã xác thực OTP.',
        };
    }
    async patientVerifyOtp(email, otpCode) {
        const account = await this.patientAccountsRepo.findOne({
            where: { email },
        });
        if (!account) {
            throw new common_1.UnauthorizedException('Tài khoản không tồn tại!');
        }
        if (account.isActive) {
            return {
                success: false,
                message: 'Tài khoản này đã được xác thực trước đó.',
            };
        }
        if (account.otpCode !== otpCode) {
            throw new common_1.UnauthorizedException('Mã xác thực không chính xác!');
        }
        account.isActive = true;
        account.otpCode = null;
        await this.patientAccountsRepo.save(account);
        const payload = { id: account.id, role: 'PATIENT' };
        const access_token = this.jwtService.sign(payload);
        const primaryPatient = await this.patientsRepo.findOne({
            where: { patientAccountId: account.id, relationship: 'Bản thân' },
        });
        return {
            success: true,
            access_token,
            user: {
                id: account.id,
                email: account.email,
                role: 'PATIENT',
                fullName: primaryPatient ? primaryPatient.fullName : 'Bệnh nhân',
            },
        };
    }
    async updatePatientAccount(accountId, updateDto) {
        const account = await this.patientAccountsRepo.findOne({ where: { id: accountId } });
        if (!account) {
            throw new common_1.UnauthorizedException('Không tìm thấy tài khoản');
        }
        if (updateDto.email) {
            const existingEmail = await this.patientAccountsRepo.findOne({ where: { email: updateDto.email } });
            if (existingEmail && existingEmail.id !== accountId) {
                throw new common_1.UnauthorizedException('Email này đã được sử dụng bởi tài khoản khác');
            }
            account.email = updateDto.email;
        }
        if (updateDto.oldPassword && updateDto.newPassword) {
            const isMatch = account.passwordHash.startsWith('$2')
                ? await bcrypt.compare(updateDto.oldPassword, account.passwordHash)
                : account.passwordHash === updateDto.oldPassword;
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Mật khẩu hiện tại không chính xác');
            }
            account.passwordHash = await bcrypt.hash(updateDto.newPassword, 10);
        }
        await this.patientAccountsRepo.save(account);
        return {
            success: true,
            message: 'Cập nhật tài khoản thành công',
            user: {
                id: account.id,
                email: account.email,
                phone: account.phone,
            }
        };
    }
    async forgotPassword(email) {
        const account = await this.patientAccountsRepo.findOne({ where: { email } });
        if (!account) {
            throw new common_1.UnauthorizedException('Không tìm thấy tài khoản với email này!');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        account.otpCode = otp;
        await this.patientAccountsRepo.save(account);
        this.mailService.sendForgotPasswordOTP(email, otp).catch((e) => console.error(e));
        return {
            success: true,
            message: 'Mã xác minh đã được gửi đến email của bạn.',
        };
    }
    async verifyResetOtp(email, otpCode) {
        const account = await this.patientAccountsRepo.findOne({ where: { email } });
        if (!account) {
            throw new common_1.UnauthorizedException('Không tìm thấy tài khoản!');
        }
        if (account.otpCode !== otpCode) {
            throw new common_1.UnauthorizedException('Mã xác thực không chính xác!');
        }
        return { success: true, message: 'Mã hợp lệ. Vui lòng nhập mật khẩu mới.' };
    }
    async resetPassword(email, otpCode, newPassword) {
        const account = await this.patientAccountsRepo.findOne({ where: { email } });
        if (!account) {
            throw new common_1.UnauthorizedException('Không tìm thấy tài khoản!');
        }
        if (account.otpCode !== otpCode) {
            throw new common_1.UnauthorizedException('Mã xác thực không chính xác!');
        }
        account.passwordHash = await bcrypt.hash(newPassword, 10);
        account.otpCode = null;
        await this.patientAccountsRepo.save(account);
        return { success: true, message: 'Đổi mật khẩu thành công!' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(PatientAccounts_1.PatientAccounts)),
    __param(2, (0, typeorm_1.InjectRepository)(DoctorProfiles_1.DoctorProfiles)),
    __param(3, (0, typeorm_1.InjectRepository)(Patients_1.Patients)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map