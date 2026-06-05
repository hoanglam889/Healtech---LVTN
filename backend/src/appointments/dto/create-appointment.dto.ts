export class CreateAppointmentDto {
  patientId: number;
  doctorProfileId: number;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: 'CASH' | 'VNPAY';
}
