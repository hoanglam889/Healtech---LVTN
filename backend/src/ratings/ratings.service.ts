import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ratings } from '../entities/Ratings';
import { Repository } from 'typeorm';
import { Appointments } from '../entities/Appointments';
import { DoctorProfiles } from '../entities/DoctorProfiles';
@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Ratings)
    private readonly ratingsRepository: Repository<Ratings>,
     @InjectRepository(Appointments)
    private appointmentsRepo: Repository<Appointments>,
    @InjectRepository(DoctorProfiles)
    private doctorProfilesRepo: Repository<DoctorProfiles>,
  ) {}
  async create(createRatingDto: CreateRatingDto) {
    const { appointmentId, rating, comment } = createRatingDto;

    // 1. Tìm đơn khám, nhớ join với bảng patient và rating
    const appointment = await this.appointmentsRepo.findOne({
      where: { id: appointmentId },
      relations: { patient: true, rating: true }, // Lấy thêm patient để có accountId và rating để check trùng
    });

    // 2. Validate các điều kiện
    if (!appointment) throw new BadRequestException('Đơn khám không tồn tại!');
    if (appointment.status !== 'DONE') throw new BadRequestException('Chỉ được đánh giá khi đơn khám đã hoàn thành!');
    if (appointment.rating) throw new BadRequestException('Bạn đã đánh giá đơn khám này rồi!');

    // 3. Tạo Rating mới
    const newRating = this.ratingsRepository.create({
      appointment_id: appointmentId,
      doctor_profile_id: appointment.doctorProfileId as number,
      // Lấy account id từ patient profile
      patient_account_id: appointment.patient.patientAccountId as number,
      rating: rating,
      comment: comment,
    });

    // Lưu vào bảng Ratings
    const savedRating = await this.ratingsRepository.save(newRating);

    // 4. Tìm và Cập nhật điểm cho Bác sĩ
    if (appointment.doctorProfileId) {
      const doctor = await this.doctorProfilesRepo.findOne({
        where: { id: appointment.doctorProfileId }
      });
      
      if (doctor) {
        const currentTotal = doctor.total_reviews || 0;
        const currentAvg = Number(doctor.average_rating) || 0;
        
        // Công thức tính trung bình tĩnh giản
        const newTotal = currentTotal + 1;
        const newAvg = ((currentAvg * currentTotal) + rating) / newTotal;

        // Cập nhật lại số liệu
        doctor.total_reviews = newTotal;
        doctor.average_rating = Number(newAvg.toFixed(1)); // Làm tròn 1 chữ số
        
        await this.doctorProfilesRepo.save(doctor);
      }
    }

    return { 
      success: true, 
      message: 'Lưu đánh giá thành công!',
      data: savedRating
    };
  }
  findAll(doctorId?: number) {
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

  async findOne(id: number) {
    const rating = await this.ratingsRepository.findOne({
      where: { id },
      relations: { patient_account: true, doctor_profile: true },
    });
    if (!rating) throw new NotFoundException('Không tìm thấy đánh giá!');
    return rating;
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
