export class CreatePatientDto {
  patientAccountId?: number;
  relationship?: string;
  cccd?: string;
  fullName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address?: string;
}
