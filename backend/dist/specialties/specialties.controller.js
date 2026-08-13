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
exports.SpecialtiesController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../auth/public.decorator");
const specialties_service_1 = require("./specialties.service");
const create_specialty_dto_1 = require("./dto/create-specialty.dto");
const update_specialty_dto_1 = require("./dto/update-specialty.dto");
let SpecialtiesController = class SpecialtiesController {
    specialtiesService;
    constructor(specialtiesService) {
        this.specialtiesService = specialtiesService;
    }
    create(createSpecialtyDto) {
        return this.specialtiesService.create(createSpecialtyDto);
    }
    findAll() {
        return this.specialtiesService.findAll();
    }
    findOne(id) {
        return this.specialtiesService.findOne(+id);
    }
    update(id, updateSpecialtyDto) {
        return this.specialtiesService.update(+id, updateSpecialtyDto);
    }
    remove(id) {
        return this.specialtiesService.remove(+id);
    }
};
exports.SpecialtiesController = SpecialtiesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_specialty_dto_1.CreateSpecialtyDto]),
    __metadata("design:returntype", void 0)
], SpecialtiesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpecialtiesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpecialtiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_specialty_dto_1.UpdateSpecialtyDto]),
    __metadata("design:returntype", void 0)
], SpecialtiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpecialtiesController.prototype, "remove", null);
exports.SpecialtiesController = SpecialtiesController = __decorate([
    (0, common_1.Controller)('specialties'),
    __metadata("design:paramtypes", [specialties_service_1.SpecialtiesService])
], SpecialtiesController);
//# sourceMappingURL=specialties.controller.js.map