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
exports.SpecialtiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const Specialties_1 = require("../entities/Specialties");
const typeorm_2 = require("@nestjs/typeorm");
let SpecialtiesService = class SpecialtiesService {
    specialtiesRepository;
    constructor(specialtiesRepository) {
        this.specialtiesRepository = specialtiesRepository;
    }
    async create(createSpecialtyDto) {
        const specialty = this.specialtiesRepository.create(createSpecialtyDto);
        return this.specialtiesRepository.save(specialty);
    }
    findAll() {
        return this.specialtiesRepository.find();
    }
    async findOne(id) {
        const specialty = await this.specialtiesRepository.findOne({
            where: { id },
        });
        if (!specialty) {
            throw new common_1.NotFoundException(`Không tìm thấy chuyên khoa #${id}`);
        }
        return specialty;
    }
    async update(id, updateSpecialtyDto) {
        const specialty = await this.findOne(id);
        this.specialtiesRepository.merge(specialty, updateSpecialtyDto);
        return this.specialtiesRepository.save(specialty);
    }
    async remove(id) {
        const specialty = await this.findOne(id);
        await this.specialtiesRepository.remove(specialty);
        return { success: true, message: `Đã xóa chuyên khoa #${id}` };
    }
};
exports.SpecialtiesService = SpecialtiesService;
exports.SpecialtiesService = SpecialtiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(Specialties_1.Specialties)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], SpecialtiesService);
//# sourceMappingURL=specialties.service.js.map