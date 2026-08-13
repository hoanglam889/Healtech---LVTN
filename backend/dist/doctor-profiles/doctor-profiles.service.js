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
exports.DoctorProfilesService = void 0;
const common_1 = require("@nestjs/common");
const DoctorProfiles_1 = require("../entities/DoctorProfiles");
const Users_1 = require("../entities/Users");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
let DoctorProfilesService = class DoctorProfilesService {
    doctorProfilesRepo;
    usersRepo;
    constructor(doctorProfilesRepo, usersRepo) {
        this.doctorProfilesRepo = doctorProfilesRepo;
        this.usersRepo = usersRepo;
    }
    async create(dto) {
        const { phone, email, password, fullName, specialtyId, experienceYears, avatarUrl, } = dto;
        if (!phone || !email || !password || !fullName || !specialtyId) {
            throw new common_1.BadRequestException('Vui lòng điền đầy đủ các trường bắt buộc!');
        }
        const existingUser = await this.usersRepo.findOne({ where: { phone } });
        if (existingUser) {
            throw new common_1.BadRequestException('Số điện thoại này đã được đăng ký tài khoản!');
        }
        const existingEmail = await this.usersRepo.findOne({ where: { email } });
        if (existingEmail) {
            throw new common_1.BadRequestException('Email này đã được đăng ký tài khoản!');
        }
        const user = new Users_1.Users();
        user.phone = phone;
        user.email = email;
        user.passwordHash = await bcrypt.hash(password, 10);
        user.role = 'DOCTOR';
        user.isActive = true;
        const savedUser = await this.usersRepo.save(user);
        const profile = new DoctorProfiles_1.DoctorProfiles();
        profile.userId = savedUser.id;
        profile.specialtyId = +specialtyId;
        profile.fullName = fullName;
        profile.experienceYears = experienceYears ? +experienceYears : 0;
        profile.avatarUrl = avatarUrl || '/uploads/default-doctor.png';
        const savedProfile = await this.doctorProfilesRepo.save(profile);
        return this.findOne(savedProfile.id);
    }
    findAll() {
        return this.doctorProfilesRepo.find({
            relations: {
                specialty: true,
                doctorSchedules: {
                    shift: true,
                },
                user: true,
            },
        });
    }
    async findOne(id) {
        const profile = await this.doctorProfilesRepo.findOne({
            where: { id },
            relations: {
                specialty: true,
                doctorSchedules: {
                    shift: true,
                },
                user: true,
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Không tìm thấy hồ sơ bác sĩ #${id}`);
        }
        return profile;
    }
    async update(id, dto) {
        const profile = await this.findOne(id);
        const { phone, email, password, fullName, specialtyId, experienceYears, avatarUrl, } = dto;
        if (profile.userId) {
            const userUpdate = {};
            if (phone) {
                const existing = await this.usersRepo.findOne({ where: { phone } });
                if (existing && existing.id !== profile.userId) {
                    throw new common_1.BadRequestException('Số điện thoại này đã tồn tại trên hệ thống!');
                }
                userUpdate.phone = phone;
            }
            if (email) {
                const existingEmail = await this.usersRepo.findOne({ where: { email } });
                if (existingEmail && existingEmail.id !== profile.userId) {
                    throw new common_1.BadRequestException('Email này đã tồn tại trên hệ thống!');
                }
                userUpdate.email = email;
            }
            if (password) {
                userUpdate.passwordHash = await bcrypt.hash(password, 10);
            }
            if (dto.isActive !== undefined) {
                userUpdate.isActive = dto.isActive;
            }
            if (Object.keys(userUpdate).length > 0) {
                await this.usersRepo.update(profile.userId, userUpdate);
            }
        }
        const profileUpdate = {};
        if (fullName)
            profileUpdate.fullName = fullName;
        if (specialtyId)
            profileUpdate.specialtyId = +specialtyId;
        if (experienceYears !== undefined)
            profileUpdate.experienceYears = +experienceYears;
        if (avatarUrl)
            profileUpdate.avatarUrl = avatarUrl;
        if (Object.keys(profileUpdate).length > 0) {
            await this.doctorProfilesRepo.update(id, profileUpdate);
        }
        return this.findOne(id);
    }
    async remove(id) {
        const profile = await this.findOne(id);
        if (profile.userId) {
            await this.usersRepo.update(profile.userId, { isActive: false });
        }
        return {
            success: true,
            message: `Đã khóa tài khoản bác sĩ #${id} thành công`,
        };
    }
};
exports.DoctorProfilesService = DoctorProfilesService;
exports.DoctorProfilesService = DoctorProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(DoctorProfiles_1.DoctorProfiles)),
    __param(1, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DoctorProfilesService);
//# sourceMappingURL=doctor-profiles.service.js.map