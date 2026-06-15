export class CreateDoctorProfileDto {
  userId: number;
  specialtyId: number;
  fullName: string;
  experienceYears?: number;
  avatarUrl?: string;
}
