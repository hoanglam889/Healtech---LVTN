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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Ratings_1 = require("../entities/Ratings");
const typeorm_2 = require("typeorm");
const Appointments_1 = require("../entities/Appointments");
const DoctorProfiles_1 = require("../entities/DoctorProfiles");
let RatingsService = class RatingsService {
    ratingsRepository;
    appointmentsRepo;
    doctorProfilesRepo;
    constructor(ratingsRepository, appointmentsRepo, doctorProfilesRepo) {
        this.ratingsRepository = ratingsRepository;
        this.appointmentsRepo = appointmentsRepo;
        this.doctorProfilesRepo = doctorProfilesRepo;
    }
    async create(createRatingDto) {
        const { appointmentId, rating, comment } = createRatingDto;
        const appointment = await this.appointmentsRepo.findOne({
            where: { id: appointmentId },
            relations: { patient: true, rating: true },
        });
        if (!appointment)
            throw new common_1.BadRequestException('Đơn khám không tồn tại!');
        if (appointment.status !== 'DONE')
            throw new common_1.BadRequestException('Chỉ được đánh giá khi đơn khám đã hoàn thành!');
        if (appointment.rating)
            throw new common_1.BadRequestException('Bạn đã đánh giá đơn khám này rồi!');
        const newRating = this.ratingsRepository.create({
            appointment_id: appointmentId,
            doctor_profile_id: appointment.doctorProfileId,
            patient_account_id: appointment.patient.patientAccountId,
            rating: rating,
            comment: comment,
        });
        const savedRating = await this.ratingsRepository.save(newRating);
        if (appointment.doctorProfileId) {
            const doctor = await this.doctorProfilesRepo.findOne({
                where: { id: appointment.doctorProfileId }
            });
            if (doctor) {
                const currentTotal = doctor.total_reviews || 0;
                const currentAvg = Number(doctor.average_rating) || 0;
                const newTotal = currentTotal + 1;
                const newAvg = ((currentAvg * currentTotal) + rating) / newTotal;
                doctor.total_reviews = newTotal;
                doctor.average_rating = Number(newAvg.toFixed(1));
                await this.doctorProfilesRepo.save(doctor);
            }
        }
        return {
            success: true,
            message: 'Lưu đánh giá thành công!',
            data: savedRating
        };
    }
    findAll(doctorId) {
        const whereCondition = doctorId ? { doctor_profile_id: doctorId } : {};
        return this.ratingsRepository.find({
            where: whereCondition,
            relations: {
                patient_account: { patients: true },
                doctor_profile: { specialty: true },
                appointment: true
            },
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const rating = await this.ratingsRepository.findOne({
            where: { id },
            relations: { patient_account: true, doctor_profile: true },
        });
        if (!rating)
            throw new common_1.NotFoundException('Không tìm thấy đánh giá!');
        return rating;
    }
    update(id, updateRatingDto) {
        return `This action updates a #${id} rating`;
    }
    remove(id) {
        return `This action removes a #${id} rating`;
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Ratings_1.Ratings)),
    __param(1, (0, typeorm_1.InjectRepository)(Appointments_1.Appointments)),
    __param(2, (0, typeorm_1.InjectRepository)(DoctorProfiles_1.DoctorProfiles)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map