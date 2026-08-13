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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const Services_1 = require("../entities/Services");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let ServicesService = class ServicesService {
    servicesRepo;
    constructor(servicesRepo) {
        this.servicesRepo = servicesRepo;
    }
    async create(createServiceDto) {
        const newService = this.servicesRepo.create(createServiceDto);
        return await this.servicesRepo.save(newService);
    }
    async findAll() {
        return this.servicesRepo.find({ where: { isActive: true } });
    }
    async findOne(id) {
        return this.servicesRepo.findOne({
            where: {
                id: id,
                isActive: true,
            },
        });
    }
    async update(id, updateServiceDto) {
        await this.servicesRepo.update(id, updateServiceDto);
        return await this.findOne(id);
    }
    async remove(id) {
        await this.servicesRepo.update(id, { isActive: false });
        return { message: 'Đã ngưng sử dụng dịch vụ này' };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(Services_1.Services)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map