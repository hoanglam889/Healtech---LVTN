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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Patients_1 = require("../entities/Patients");
let PatientsService = class PatientsService {
    patientsRepository;
    constructor(patientsRepository) {
        this.patientsRepository = patientsRepository;
    }
    async create(createPatientDto) {
        const birthYear = new Date(createPatientDto.dob).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        const isCompleted = !!(createPatientDto.fullName &&
            createPatientDto.dob &&
            (createPatientDto.cccd || age < 16) &&
            createPatientDto.address &&
            createPatientDto.gender &&
            createPatientDto.phone);
        const newPatient = this.patientsRepository.create({
            ...createPatientDto,
            isCompleted,
        });
        return await this.patientsRepository.save(newPatient);
    }
    async findAll(patientAccountId) {
        return await this.patientsRepository.find({
            where: patientAccountId ? { patientAccountId } : {},
        });
    }
    async findOne(id) {
        const patient = await this.patientsRepository.findOneBy({ id });
        if (!patient) {
            throw new common_1.NotFoundException(`Không tìm thấy bệnh nhân với ID: ${id}`);
        }
        return patient;
    }
    async update(id, updatePatientDto) {
        const patient = await this.findOne(id);
        const mergedData = { ...patient, ...updatePatientDto };
        const birthYear = new Date(mergedData.dob).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        const isCompleted = !!(mergedData.fullName &&
            mergedData.dob &&
            (mergedData.cccd || age < 16) &&
            mergedData.address &&
            mergedData.gender &&
            mergedData.phone);
        await this.patientsRepository.update(id, {
            ...updatePatientDto,
            isCompleted,
        });
        return this.findOne(id);
    }
    async remove(id) {
        const patient = await this.findOne(id);
        await this.patientsRepository.remove(patient);
        return { success: true };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Patients_1.Patients)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientsService);
//# sourceMappingURL=patients.service.js.map