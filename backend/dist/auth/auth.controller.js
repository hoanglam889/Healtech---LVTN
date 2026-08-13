"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const public_decorator_1 = require("./public.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async staffLogin(body, res) {
        const { email, password } = body;
        if (!email || !password) {
            throw new common_1.BadRequestException('Vui lòng điền email và mật khẩu!');
        }
        const loginData = await this.authService.staffLogin(email, password);
        res.cookie('acces_token', loginData.access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 5 * 60 * 60 * 1000,
        });
        const { access_token, ...userData } = loginData;
        return userData;
    }
    async patientLogin(body, res) {
        const { email, password } = body;
        if (!email || !password) {
            throw new common_1.BadRequestException('Vui lòng điền email và mật khẩu!');
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
    async patientRegister(body, res) {
        const { email, password, fullName, dob, gender } = body;
        if (!email || !password || !fullName) {
            throw new common_1.BadRequestException('Họ tên, email và mật khẩu là bắt buộc!');
        }
        const regData = await this.authService.patientRegister(email, password, fullName, dob, gender);
        return regData;
    }
    async patientVerifyOtp(body, res) {
        const { email, otpCode } = body;
        if (!email || !otpCode) {
            throw new common_1.BadRequestException('Email và mã OTP là bắt buộc!');
        }
        const verifyData = await this.authService.patientVerifyOtp(email, otpCode);
        if (verifyData.success) {
            res.cookie('acces_token', verifyData.access_token, {
                httpOnly: true,
                secure: false,
                maxAge: 5 * 60 * 60 * 1000,
            });
            const { access_token, ...userData } = verifyData;
            return userData;
        }
        return verifyData;
    }
    async updatePatientAccount(req, body) {
        const userId = req.user.id;
        if (!userId || req.user.role !== 'PATIENT') {
            throw new common_1.BadRequestException('Bạn không có quyền thực hiện thao tác này');
        }
        return this.authService.updatePatientAccount(userId, body);
    }
    async forgotPassword(body) {
        if (!body.email)
            throw new common_1.BadRequestException('Vui lòng cung cấp email');
        return this.authService.forgotPassword(body.email);
    }
    async verifyResetOtp(body) {
        if (!body.email || !body.otpCode)
            throw new common_1.BadRequestException('Thiếu thông tin xác thực');
        return this.authService.verifyResetOtp(body.email, body.otpCode);
    }
    async resetPassword(body) {
        if (!body.email || !body.otpCode || !body.newPassword) {
            throw new common_1.BadRequestException('Thiếu thông tin đặt lại mật khẩu');
        }
        return this.authService.resetPassword(body.email, body.otpCode, body.newPassword);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('staff-login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "staffLogin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('patient-login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "patientLogin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('patient-register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "patientRegister", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('patient-verify-otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "patientVerifyOtp", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('patient-account/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePatientAccount", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('verify-reset-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map